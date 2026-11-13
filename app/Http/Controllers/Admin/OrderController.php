<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Drink;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'all');
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 5);
        if (! in_array($perPage, [5, 10, 15, 25, 50], true)) {
            $perPage = 5;
        }

        $query = Order::with('items')->latest();

        if ($status !== 'all' && in_array($status, [Order::STATUS_PENDING, Order::STATUS_CONFIRMED, Order::STATUS_CANCELLED], true)) {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search): void {
                $q->where('order_code', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate($perPage)->withQueryString();

        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', Order::STATUS_PENDING)->count(),
            'confirmed_orders' => Order::where('status', Order::STATUS_CONFIRMED)->count(),
            'total_revenue' => (int) Order::where('status', Order::STATUS_CONFIRMED)->sum('total_price'),
            'formatted_total_revenue' => 'Rp '.number_format((int) Order::where('status', Order::STATUS_CONFIRMED)->sum('total_price'), 0, ',', '.'),
        ];

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'filters' => [
                'status' => $status,
                'search' => $search ?? '',
                'per_page' => $perPage,
            ],
            'stats' => $stats,
        ]);
    }

    public function confirm(Order $order): RedirectResponse
    {
        if ($order->status !== Order::STATUS_PENDING) {
            return back()->with('error', 'Hanya pesanan berstatus Menunggu (Pending) yang dapat dikonfirmasi.');
        }

        return DB::transaction(function () use ($order): RedirectResponse {
            // Eager load items
            $order->load('items');

            // Verify stock availability with lock
            foreach ($order->items as $item) {
                $drink = Drink::where('id', $item->drink_id)->lockForUpdate()->first();

                if (! $drink) {
                    return back()->with('error', "Minuman '{$item->drink_name}' tidak lagi ditemukan di database.");
                }

                if ($drink->stock < $item->quantity) {
                    return back()->with(
                        'error',
                        "Gagal konfirmasi: Stok '{$drink->name}' tidak mencukupi (Tersedia: {$drink->stock}, Dipesan: {$item->quantity})."
                    );
                }
            }

            // Decrement stock for all items
            foreach ($order->items as $item) {
                $drink = Drink::where('id', $item->drink_id)->first();
                $drink->decrement('stock', $item->quantity);
            }

            $order->update([
                'status' => Order::STATUS_CONFIRMED,
                'confirmed_at' => now(),
            ]);

            return back()->with(
                'success',
                "Pesanan {$order->order_code} berhasil dikonfirmasi! Stok minuman telah otomatis dipotong."
            );
        });
    }

    public function cancel(Order $order): RedirectResponse
    {
        if ($order->status === Order::STATUS_CANCELLED) {
            return back()->with('error', 'Pesanan ini sudah dibatalkan sebelumnya.');
        }

        DB::transaction(function () use ($order): void {
            // If the order was already confirmed, restore the stock
            if ($order->status === Order::STATUS_CONFIRMED) {
                $order->load('items');
                foreach ($order->items as $item) {
                    $drink = Drink::find($item->drink_id);
                    if ($drink) {
                        $drink->increment('stock', $item->quantity);
                    }
                }
            }

            $order->update([
                'status' => Order::STATUS_CANCELLED,
            ]);
        });

        return back()->with('success', "Pesanan {$order->order_code} berhasil dibatalkan.");
    }
}
