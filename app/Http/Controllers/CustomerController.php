<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $query = Drink::query()->where('is_active', true);

        if (! empty($search)) {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (! empty($category) && $category !== 'Semua') {
            $query->where('category', $category);
        }

        $drinks = $query->orderBy('name')->get();

        $categories = Drink::query()
            ->where('is_active', true)
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('Customer/Catalog', [
            'drinks' => $drinks,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
            'whatsappNumber' => config('services.whatsapp.number', '6281234567890'),
        ]);
    }

    public function checkout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:100'],
            'customer_phone' => ['required', 'string', 'max:25'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'exists:drinks,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($validated): RedirectResponse {
            $drinkIds = collect($validated['items'])->pluck('id');
            $drinks = Drink::whereIn('id', $drinkIds)->get()->keyBy('id');

            $totalPrice = 0;
            $itemsData = [];

            foreach ($validated['items'] as $itemInput) {
                $drink = $drinks->get($itemInput['id']);
                $qty = (int) $itemInput['quantity'];

                if (! $drink || ! $drink->is_active) {
                    return back()->with('error', 'Salah satu minuman yang dipilih tidak lagi tersedia.');
                }

                if ($drink->stock < $qty) {
                    return back()->with(
                        'error',
                        "Stok untuk {$drink->name} tidak mencukupi (Tersedia: {$drink->stock}, diminta: {$qty})."
                    );
                }

                $subtotal = $drink->price * $qty;
                $totalPrice += $subtotal;

                $itemsData[] = [
                    'drink' => $drink,
                    'quantity' => $qty,
                    'price' => $drink->price,
                    'subtotal' => $subtotal,
                ];
            }

            $orderCode = 'MD-'.now()->format('Ymd').'-'.strtoupper(Str::random(5));

            $order = Order::create([
                'order_code' => $orderCode,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'notes' => $validated['notes'] ?? null,
                'total_price' => $totalPrice,
                'status' => Order::STATUS_PENDING,
            ]);

            foreach ($itemsData as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'drink_id' => $item['drink']->id,
                    'drink_name' => $item['drink']->name,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            // Clean admin WhatsApp phone number (strip spaces, +, -, etc.)
            $rawAdminPhone = (string) config('services.whatsapp.number', '6281234567890');
            $cleanAdminPhone = preg_replace('/[^0-9]/', '', $rawAdminPhone);
            if (str_starts_with($cleanAdminPhone, '0')) {
                $cleanAdminPhone = '62'.substr($cleanAdminPhone, 1);
            }

            // Build WhatsApp message
            $messageLines = [
                '🦊 *PESANAN BARU - METADRINK*',
                '--------------------------------',
                "📋 *Kode Order:* {$order->order_code}",
                "👤 *Nama Pemesan:* {$order->customer_name}",
                "📱 *No WhatsApp:* {$order->customer_phone}",
                '',
                '🛒 *Rincian Minuman:*',
            ];

            foreach ($itemsData as $item) {
                $formattedSubtotal = 'Rp '.number_format($item['subtotal'], 0, ',', '.');
                $messageLines[] = "• {$item['quantity']}x {$item['drink']->name} = {$formattedSubtotal}";
            }

            $messageLines[] = '--------------------------------';
            $messageLines[] = '💰 *Total Pembayaran:* '.$order->formatted_total_price;

            if (! empty($order->notes)) {
                $messageLines[] = "📝 *Catatan:* {$order->notes}";
            }

            $messageLines[] = '';
            $messageLines[] = 'Mohon konfirmasi pesanan saya. Terima kasih!';

            $whatsappMessage = implode("\n", $messageLines);
            $whatsappUrl = 'https://api.whatsapp.com/send?phone='.$cleanAdminPhone.'&text='.rawurlencode($whatsappMessage);

            return back()->with([
                'success' => 'Pesanan berhasil dibuat! Silakan lanjutkan konfirmasi melalui WhatsApp.',
                'orderCreated' => [
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer_name,
                    'total_price' => $order->formatted_total_price,
                    'whatsapp_url' => $whatsappUrl,
                ],
            ]);
        });
    }
}
