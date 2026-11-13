<?php

namespace Tests\Feature;

use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DrinkFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_drink_catalog(): void
    {
        Drink::factory()->create([
            'name' => 'Signature MetaMask Latte',
            'price' => 25000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $response = $this->get(route('catalog'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Customer/Catalog')
            ->where('categories.0', 'Ambmanggo')
            ->where('categories.1', 'Amberry')
            ->where('categories.2', 'Ambpinaple')
        );
    }

    public function test_guest_can_order_drinks_without_user_account(): void
    {
        $drink1 = Drink::factory()->create([
            'name' => 'Meta Fox Mocha',
            'price' => 28000,
            'stock' => 15,
            'is_active' => true,
        ]);

        $drink2 = Drink::factory()->create([
            'name' => 'Cold Brew Nitro',
            'price' => 20000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $response = $this->post(route('checkout'), [
            'customer_name' => 'Siti Rahma',
            'customer_phone' => '081298765432',
            'notes' => 'Tolong buatkan less ice',
            'items' => [
                ['id' => $drink1->id, 'quantity' => 2],
                ['id' => $drink2->id, 'quantity' => 1],
            ],
        ]);

        $response->assertSessionHas('success');
        $response->assertSessionHas('orderCreated');

        // Order is created in pending status
        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Siti Rahma',
            'customer_phone' => '081298765432',
            'notes' => 'Tolong buatkan less ice',
            'total_price' => (28000 * 2) + (20000 * 1), // 76000
            'status' => Order::STATUS_PENDING,
        ]);

        // Stock is NOT yet reduced until confirmed
        $this->assertEquals(15, $drink1->fresh()->stock);
        $this->assertEquals(10, $drink2->fresh()->stock);

        // Verify order items exist
        $this->assertDatabaseHas('order_items', [
            'drink_name' => 'Meta Fox Mocha',
            'quantity' => 2,
            'price' => 28000,
            'subtotal' => 56000,
        ]);

        // Verify WhatsApp API URL targeting env number with drink & price details
        $orderCreated = session('orderCreated');
        $this->assertNotEmpty($orderCreated['whatsapp_url']);
        $this->assertStringContainsString('https://api.whatsapp.com/send?phone=', $orderCreated['whatsapp_url']);
        $this->assertStringContainsString(config('services.whatsapp.number'), $orderCreated['whatsapp_url']);
        $this->assertStringContainsString('Meta%20Fox%20Mocha%20%282x%29', $orderCreated['whatsapp_url']);
        $this->assertStringContainsString('Total%20Bayar%3A%20Rp%2076.000', $orderCreated['whatsapp_url']);
    }

    public function test_checkout_fails_if_quantity_exceeds_stock(): void
    {
        $drink = Drink::factory()->create([
            'name' => 'Limited Edition Matcha',
            'price' => 30000,
            'stock' => 3,
            'is_active' => true,
        ]);

        $response = $this->post(route('checkout'), [
            'customer_name' => 'Ahmad',
            'customer_phone' => '08111222333',
            'items' => [
                ['id' => $drink->id, 'quantity' => 5], // exceeds stock 3
            ],
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_admin_can_confirm_order_and_stocks_are_automatically_reduced(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
        ]);

        $drinkA = Drink::factory()->create([
            'name' => 'Espresso Doppio',
            'price' => 20000,
            'stock' => 20,
        ]);

        $drinkB = Drink::factory()->create([
            'name' => 'Vanilla Shake',
            'price' => 25000,
            'stock' => 12,
        ]);

        $order = Order::create([
            'order_code' => 'ORD-TEST-001',
            'customer_name' => 'Budi',
            'customer_phone' => '08123456789',
            'total_price' => 70000,
            'status' => Order::STATUS_PENDING,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'drink_id' => $drinkA->id,
            'drink_name' => $drinkA->name,
            'quantity' => 2,
            'price' => $drinkA->price,
            'subtotal' => 40000,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'drink_id' => $drinkB->id,
            'drink_name' => $drinkB->name,
            'quantity' => 1,
            'price' => $drinkB->price,
            'subtotal' => 25000,
        ]);

        // Action: Admin confirms order
        $response = $this->actingAs($admin)
            ->post(route('admin.orders.confirm', $order));

        $response->assertSessionHas('success');

        // Order is now confirmed
        $this->assertEquals(Order::STATUS_CONFIRMED, $order->fresh()->status);
        $this->assertNotNull($order->fresh()->confirmed_at);

        // Core business rule: Stocks are automatically decreased!
        $this->assertEquals(18, $drinkA->fresh()->stock); // 20 - 2 = 18
        $this->assertEquals(11, $drinkB->fresh()->stock); // 12 - 1 = 11
    }

    public function test_cannot_confirm_order_if_stock_became_insufficient(): void
    {
        $admin = User::factory()->create();

        $drink = Drink::factory()->create([
            'name' => 'Rare Coffee',
            'price' => 50000,
            'stock' => 1, // Only 1 left
        ]);

        $order = Order::create([
            'order_code' => 'ORD-TEST-002',
            'customer_name' => 'Dewi',
            'customer_phone' => '08123456789',
            'total_price' => 100000,
            'status' => Order::STATUS_PENDING,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'drink_id' => $drink->id,
            'drink_name' => $drink->name,
            'quantity' => 3, // Ordered 3, but only 1 in stock
            'price' => 50000,
            'subtotal' => 100000,
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.orders.confirm', $order));

        $response->assertSessionHas('error');

        // Order remains pending, stock untouched
        $this->assertEquals(Order::STATUS_PENDING, $order->fresh()->status);
        $this->assertEquals(1, $drink->fresh()->stock);
    }

    public function test_admin_can_manage_drinks(): void
    {
        $admin = User::factory()->create();

        // Create
        $response = $this->actingAs($admin)->post(route('admin.drinks.store'), [
            'name' => 'Polygon Sparkling Orange',
            'category' => 'Mocktail',
            'price' => 22000,
            'stock' => 30,
            'description' => 'Minuman jeruk soda segar',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('drinks', [
            'name' => 'Polygon Sparkling Orange',
            'price' => 22000,
            'stock' => 30,
        ]);

        $drink = Drink::where('name', 'Polygon Sparkling Orange')->first();

        // Quick stock update
        $this->actingAs($admin)->patch(route('admin.drinks.stock', $drink), [
            'stock' => 45,
        ]);
        $this->assertEquals(45, $drink->fresh()->stock);

        // Delete
        $this->actingAs($admin)->delete(route('admin.drinks.destroy', $drink));
        $this->assertDatabaseMissing('drinks', ['id' => $drink->id]);
    }

    public function test_admin_can_paginate_orders_and_customize_per_page(): void
    {
        $admin = User::factory()->create();

        // Create 8 dummy orders
        for ($i = 1; $i <= 8; $i++) {
            Order::create([
                'order_code' => "ORD-PAG-$i",
                'customer_name' => "Customer $i",
                'customer_phone' => '08123456789',
                'total_price' => 30000,
                'status' => Order::STATUS_PENDING,
            ]);
        }

        $response = $this->actingAs($admin)
            ->get(route('admin.orders.index', ['per_page' => 5]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Orders')
            ->has('orders.data', 5)
            ->where('orders.total', 8)
            ->where('orders.last_page', 2)
            ->where('filters.per_page', 5)
        );
    }
}
