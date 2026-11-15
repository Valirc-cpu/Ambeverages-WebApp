'use client';

import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import DrinkAdminCard from './DrinkAdminCard';
import DrinkFormModal from './DrinkFormModal';
import DeleteDrinkModal from './DeleteDrinkModal';
import { Coffee, Plus, Search, AlertTriangle, Layers, Boxes, Trash2 } from 'lucide-react';

export default function DrinksClient({ initialDrinks = [], initialCategories = [], initialStats = {} }) {
    const [drinks, setDrinks] = useState(initialDrinks);
    const [categories, setCategories] = useState(initialCategories);
    const [stats, setStats] = useState(initialStats);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDrink, setEditingDrink] = useState(null);
    const [deletingDrink, setDeletingDrink] = useState(null);
    const [quickStockUpdating, setQuickStockUpdating] = useState(null);

    // Form States
    const [addForm, setAddForm] = useState({
        name: '',
        category: 'Ambmanggo',
        price: '',
        stock: '',
        image_url: '',
        description: '',
    });
    const [addErrors, setAddErrors] = useState({});
    const [isAddProcessing, setIsAddProcessing] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        image_url: '',
        description: '',
        is_active: true,
    });
    const [editErrors, setEditErrors] = useState({});
    const [isEditProcessing, setIsEditProcessing] = useState(false);

    // Filter drinks
    const filteredDrinks = drinks.filter((drink) => {
        const matchesCategory = categoryFilter === 'Semua' || drink.category === categoryFilter;
        const matchesSearch =
            drink.name.toLowerCase().includes(search.toLowerCase()) ||
            (drink.description && drink.description.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const handleOpenEdit = (drink) => {
        setEditingDrink(drink);
        setEditForm({
            name: drink.name,
            category: drink.category || 'Ambmanggo',
            price: drink.price,
            stock: drink.stock,
            image_url: drink.image_url || '',
            description: drink.description || '',
            is_active: drink.is_active,
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsAddProcessing(true);
        setAddErrors({});

        try {
            const res = await fetch('/api/admin/drinks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setAddErrors({ name: data.error || 'Gagal menambahkan minuman.' });
                setIsAddProcessing(false);
                return;
            }

            // Refresh local list
            const newDrink = {
                ...data.drink,
                formatted_price: 'Rp ' + Number(data.drink.price).toLocaleString('id-ID'),
                image_url: data.drink.image || addForm.image_url || null,
            };
            setDrinks((prev) => [newDrink, ...prev]);
            setIsAddModalOpen(false);
            setAddForm({ name: '', category: 'Ambmanggo', price: '', stock: '', image_url: '', description: '' });
        } catch (err) {
            console.error('Error adding drink:', err);
            setAddErrors({ name: 'Terjadi kesalahan jaringan.' });
        } finally {
            setIsAddProcessing(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingDrink) return;
        setIsEditProcessing(true);
        setEditErrors({});

        try {
            const res = await fetch(`/api/admin/drinks/${editingDrink.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setEditErrors({ name: data.error || 'Gagal mengubah minuman.' });
                setIsEditProcessing(false);
                return;
            }

            setDrinks((prev) =>
                prev.map((d) =>
                    d.id === editingDrink.id
                        ? {
                              ...d,
                              ...editForm,
                              formatted_price: 'Rp ' + Number(editForm.price).toLocaleString('id-ID'),
                          }
                        : d
                )
            );
            setEditingDrink(null);
        } catch (err) {
            console.error('Error editing drink:', err);
            setEditErrors({ name: 'Terjadi kesalahan jaringan.' });
        } finally {
            setIsEditProcessing(false);
        }
    };

    const handleDeleteSubmit = async () => {
        if (!deletingDrink) return;

        try {
            await fetch(`/api/admin/drinks/${deletingDrink.id}`, { method: 'DELETE' });
            setDrinks((prev) => prev.filter((d) => d.id !== deletingDrink.id));
            setDeletingDrink(null);
        } catch (err) {
            console.error('Error deleting drink:', err);
            alert('Gagal menghapus minuman.');
        }
    };

    const handleQuickStockChange = async (drink, delta) => {
        const newStock = Math.max(0, drink.stock + delta);
        setQuickStockUpdating(drink.id);

        try {
            await fetch(`/api/admin/drinks/${drink.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock }),
            });

            setDrinks((prev) =>
                prev.map((d) => (d.id === drink.id ? { ...d, stock: newStock } : d))
            );
        } catch (err) {
            console.error('Error updating stock:', err);
        } finally {
            setQuickStockUpdating(null);
        }
    };

    const handleResetDatabase = async () => {
        if (!confirm('PERINGATAN: Apakah Anda yakin ingin MENGOSONGKAN SELURUH DATA minuman, pesanan, dan item di Supabase? Tindakan ini tidak dapat dibatalkan.')) {
            return;
        }
        try {
            const res = await fetch('/api/admin/reset-database', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setDrinks([]);
                alert('Sukses: Seluruh data di Supabase telah berhasil dikosongkan!');
            } else {
                alert('Gagal: ' + data.error);
            }
        } catch {
            alert('Terjadi kesalahan jaringan.');
        }
    };

    return (
        <div className="space-y-6 pt-2">
            {/* Header title & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight flex items-center gap-2.5">
                        <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#FA4B00]" />
                        <span>Katalog & Stok Minuman</span>
                    </h1>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">
                        Input menu minuman baru, atur harga, dan pantau ketersediaan stok fisik.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleResetDatabase}
                        className="text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#D73A49] dark:hover:text-[#D73A49] border border-[#E5E8EC] dark:border-[#282C34]"
                        title="Kosongkan seluruh data di database Supabase"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Kosongkan Semua Data</span>
                    </Button>
                    <Button
                        variant="orange"
                        size="md"
                        onClick={() => setIsAddModalOpen(true)}
                        className="font-bold shadow-sm text-xs sm:text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Minuman Baru</span>
                    </Button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00]">
                        <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                            Total Varian Menu
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white">
                            {drinks.length} Minuman
                        </span>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#E8F8EE] dark:bg-[#142B1C] text-[#1EBE5D]">
                        <Boxes className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                            Total Unit Stok
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white">
                            {drinks.reduce((sum, d) => sum + (Number(d.stock) || 0), 0)} Porsi
                        </span>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FEE2E2] dark:bg-[#2E1417] text-[#D73A49]">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                            Stok Kritis (≤ 5 Porsi)
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold text-[#D73A49]">
                            {drinks.filter((d) => Number(d.stock) <= 5).length} Minuman
                        </span>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-flex items-center gap-1 bg-[#ECEFF2] dark:bg-[#181A20] p-1.5 rounded-full border border-[#DCE0E5] dark:border-[#282C34] overflow-x-auto scrollbar-none">
                    {['Semua', ...categories].map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                categoryFilter === cat
                                    ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-md'
                                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative min-w-[280px]">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama atau deskripsi..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#181A20] border border-[#DCE0E5] dark:border-[#282C34] focus:border-[#FA4B00] rounded-full text-[#121417] dark:text-white placeholder-[#9CA3AF] text-xs outline-none shadow-sm transition-colors"
                    />
                </div>
            </div>

            {/* Drinks Grid */}
            {filteredDrinks.length === 0 ? (
                <Card className="text-center py-20 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <Coffee className="w-14 h-14 text-[#CBD2D9] dark:text-[#3B424E] mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#121417] dark:text-white">Belum ada menu minuman</h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Klik tombol "Tambah Minuman Baru" untuk menginputkan data minuman pertama Anda.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDrinks.map((drink) => (
                        <DrinkAdminCard
                            key={drink.id}
                            drink={drink}
                            quickStockUpdating={quickStockUpdating}
                            onQuickStockChange={handleQuickStockChange}
                            onOpenEdit={handleOpenEdit}
                            onOpenDelete={setDeletingDrink}
                        />
                    ))}
                </div>
            )}

            {/* Add Drink Modal */}
            <DrinkFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isEdit={false}
                form={{
                    data: addForm,
                    setData: (k, v) => setAddForm((prev) => ({ ...prev, [k]: v })),
                    errors: addErrors,
                    processing: isAddProcessing,
                }}
                onSubmit={handleAddSubmit}
            />

            {/* Edit Drink Modal */}
            <DrinkFormModal
                isOpen={!!editingDrink}
                onClose={() => setEditingDrink(null)}
                isEdit={true}
                form={{
                    data: editForm,
                    setData: (k, v) => setEditForm((prev) => ({ ...prev, [k]: v })),
                    errors: editErrors,
                    processing: isEditProcessing,
                }}
                onSubmit={handleEditSubmit}
            />

            {/* Delete Drink Modal */}
            <DeleteDrinkModal
                drink={deletingDrink}
                onClose={() => setDeletingDrink(null)}
                onConfirmDelete={handleDeleteSubmit}
            />
        </div>
    );
}
