<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Drink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DrinkController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $query = Drink::query();

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
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        $totalDrinks = Drink::count();
        $totalStock = Drink::sum('stock');
        $lowStockCount = Drink::where('stock', '<=', 5)->count();

        return Inertia::render('Admin/Drinks', [
            'drinks' => $drinks,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
            'stats' => [
                'total_drinks' => $totalDrinks,
                'total_stock' => $totalStock,
                'low_stock' => $lowStockCount,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url', 'max:1000'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('drinks', 'public');
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        Drink::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category' => $validated['category'] ?: 'Signature',
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'is_active' => true,
        ]);

        return back()->with('success', 'Minuman baru berhasil ditambahkan!');
    }

    public function update(Request $request, Drink $drink): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $imagePath = $drink->image;

        if ($request->hasFile('image')) {
            // Delete old file if local
            if ($drink->image && ! str_starts_with($drink->image, 'http')) {
                Storage::disk('public')->delete($drink->image);
            }
            $imagePath = $request->file('image')->store('drinks', 'public');
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        $drink->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category' => $validated['category'] ?: 'Signature',
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $drink->is_active,
        ]);

        return back()->with('success', "Data {$drink->name} berhasil diperbarui!");
    }

    public function updateStock(Request $request, Drink $drink): RedirectResponse
    {
        $validated = $request->validate([
            'stock' => ['required', 'integer', 'min:0'],
        ]);

        $drink->update(['stock' => $validated['stock']]);

        return back()->with('success', "Stok {$drink->name} diperbarui menjadi {$validated['stock']}.");
    }

    public function destroy(Drink $drink): RedirectResponse
    {
        if ($drink->image && ! str_starts_with($drink->image, 'http')) {
            Storage::disk('public')->delete($drink->image);
        }

        $drinkName = $drink->name;
        $drink->delete();

        return back()->with('success', "Minuman {$drinkName} berhasil dihapus.");
    }
}
