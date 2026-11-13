<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_code' => 'ORD-'.strtoupper(Str::random(8)),
            'customer_name' => fake()->name(),
            'customer_phone' => '08'.fake()->numerify('##########'),
            'notes' => fake()->boolean(60) ? fake()->sentence(5) : null,
            'total_price' => 50000,
            'status' => Order::STATUS_PENDING,
            'confirmed_at' => null,
        ];
    }
}
