<?php

use App\Http\Controllers\Admin\DrinkController as AdminDrinkController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

// Public Customer Routes
Route::get('/', [CustomerController::class, 'index'])->name('catalog');
Route::post('/checkout', [CustomerController::class, 'checkout'])->name('checkout');

// Admin Auth Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin Protected Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', fn () => redirect()->route('admin.orders.index'))->name('dashboard');

    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/confirm', [AdminOrderController::class, 'confirm'])->name('orders.confirm');
    Route::post('/orders/{order}/cancel', [AdminOrderController::class, 'cancel'])->name('orders.cancel');

    // Drinks Management
    Route::get('/drinks', [AdminDrinkController::class, 'index'])->name('drinks.index');
    Route::post('/drinks', [AdminDrinkController::class, 'store'])->name('drinks.store');
    Route::post('/drinks/{drink}', [AdminDrinkController::class, 'update'])->name('drinks.update');
    Route::patch('/drinks/{drink}/stock', [AdminDrinkController::class, 'updateStock'])->name('drinks.stock');
    Route::delete('/drinks/{drink}', [AdminDrinkController::class, 'destroy'])->name('drinks.destroy');
});

// Serverless / Vercel Database Migration & Seeder Helper
Route::get('/deploy/migrate', function () {
    $secret = request('secret');
    $expectedSecret = env('DEPLOY_SECRET', env('APP_KEY'));

    if (empty($secret) || $secret !== $expectedSecret) {
        abort(403, 'Akses ditolak. Parameter secret tidak sesuai.');
    }

    try {
        Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = Artisan::output();

        Artisan::call('db:seed', ['--force' => true]);
        $seedOutput = Artisan::output();

        return response("<pre style='background:#121417;color:#fff;padding:24px;border-radius:12px;font-family:monospace;font-size:14px;line-height:1.6;'>=== MIGRATION OUTPUT ===\n{$migrateOutput}\n=== SEEDER OUTPUT ===\n{$seedOutput}\n\nSUKSES: Seluruh tabel dan akun admin Ambeverages berhasil dibuat di Supabase!</pre>");
    } catch (Throwable $e) {
        return response("<pre style='background:#2d1215;color:#ff8080;padding:24px;border-radius:12px;font-family:monospace;font-size:14px;line-height:1.6;'>ERROR:\n{$e->getMessage()}\n\n{$e->getTraceAsString()}</pre>", 500);
    }
});
