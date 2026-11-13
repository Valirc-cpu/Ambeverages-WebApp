import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import DrinkAdminCard from '../../Components/Admin/DrinkAdminCard';
import DrinkFormModal from '../../Components/Admin/DrinkFormModal';
import DeleteDrinkModal from '../../Components/Admin/DeleteDrinkModal';
import {
    Coffee,
    Plus,
    Search,
    AlertTriangle,
    Layers,
    Boxes
} from 'lucide-react';

export default function Drinks({ drinks = [], categories = [], filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'Semua');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDrink, setEditingDrink] = useState(null);
    const [deletingDrink, setDeletingDrink] = useState(null);
    const [quickStockUpdating, setQuickStockUpdating] = useState(null);

    // Filter drinks
    const filteredDrinks = drinks.filter((drink) => {
        const matchesCategory =
            categoryFilter === 'Semua' || drink.category === categoryFilter;
        const matchesSearch =
            drink.name.toLowerCase().includes(search.toLowerCase()) ||
            (drink.description && drink.description.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Add Form
    const addForm = useForm({
        name: '',
        category: 'Signature',
        price: '',
        stock: '',
        image_url: '',
        image: null,
        description: '',
    });

    // Edit Form
    const editForm = useForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        image_url: '',
        image: null,
        description: '',
        is_active: true,
    });

    const handleOpenEdit = (drink) => {
        setEditingDrink(drink);
        editForm.setData({
            name: drink.name,
            category: drink.category || 'Signature',
            price: drink.price,
            stock: drink.stock,
            image_url: drink.image && drink.image.startsWith('http') ? drink.image : '',
            image: null,
            description: drink.description || '',
            is_active: drink.is_active,
        });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/drinks', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingDrink) return;

        editForm.post(`/admin/drinks/${editingDrink.id}`, {
            onSuccess: () => {
                setEditingDrink(null);
                editForm.reset();
            },
        });
    };

    const handleDeleteSubmit = () => {
        if (!deletingDrink) return;
        router.delete(`/admin/drinks/${deletingDrink.id}`, {
            onSuccess: () => setDeletingDrink(null),
        });
    };

    const handleQuickStockChange = (drink, delta) => {
        const newStock = Math.max(0, drink.stock + delta);
        setQuickStockUpdating(drink.id);
        router.patch(
            `/admin/drinks/${drink.id}/stock`,
            { stock: newStock },
            {
                preserveScroll: true,
                onFinish: () => setQuickStockUpdating(null),
            }
        );
    };

    return (
        <AdminLayout title="Kelola Menu Minuman">
            <Head title="Kelola Menu Minuman - Admin" />

            <div className="space-y-6 pt-6">
                {/* Header title & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight flex items-center gap-2.5">
                            <Coffee className="w-7 h-7 text-[#FA4B00]" />
                            <span>Katalog & Stok Minuman</span>
                        </h1>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">
                            Input menu minuman baru, atur harga, dan pantau ketersediaan stok fisik.
                        </p>
                    </div>

                    <Button
                        variant="orange"
                        size="md"
                        onClick={() => setIsAddModalOpen(true)}
                        className="font-bold shadow-[0_4px_16px_rgba(250,75,0,0.3)] shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Minuman Baru</span>
                    </Button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00]">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Varian Menu
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417] dark:text-white">
                                {stats.total_drinks || 0} Minuman
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#E8F8EE] dark:bg-[#142B1C] text-[#1EBE5D]">
                            <Boxes className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Unit Stok
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417] dark:text-white">
                                {stats.total_stock || 0} Porsi
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#FEE2E2] dark:bg-[#2E1417] text-[#D73A49]">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Stok Kritis (≤ 5 Porsi)
                            </span>
                            <span className="text-2xl font-extrabold text-[#D73A49]">
                                {stats.low_stock || 0} Minuman
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
            </div>

            {/* Modular Add Drink Modal */}
            <DrinkFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isEdit={false}
                form={addForm}
                onSubmit={handleAddSubmit}
            />

            {/* Modular Edit Drink Modal */}
            <DrinkFormModal
                isOpen={!!editingDrink}
                onClose={() => setEditingDrink(null)}
                isEdit={true}
                form={editForm}
                onSubmit={handleEditSubmit}
            />

            {/* Modular Delete Drink Modal */}
            <DeleteDrinkModal
                drink={deletingDrink}
                onClose={() => setDeletingDrink(null)}
                onConfirmDelete={handleDeleteSubmit}
            />
        </AdminLayout>
    );
}
