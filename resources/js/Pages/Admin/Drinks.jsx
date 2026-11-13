import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import {
    Coffee,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertTriangle,
    Layers,
    Boxes,
    Flame,
    Check,
    UploadCloud,
    Link as LinkIcon
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
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                            <Coffee className="w-6 h-6 text-[#F6851B]" />
                            <span>Katalog & Stok Minuman</span>
                        </h1>
                        <p className="text-xs text-[#8F96A0] mt-1">
                            Input menu minuman baru, atur harga, dan pantau ketersediaan stok fisik.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsAddModalOpen(true)}
                        className="font-bold shadow-[0_4px_16px_rgba(246,133,27,0.35)] shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Minuman Baru</span>
                    </Button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-[#F6851B]/15 text-[#F6851B]">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Total Varian Menu
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {stats.total_drinks || 0} Minuman
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-[#28A745]/15 text-[#48D168]">
                            <Boxes className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Total Unit Stok
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {stats.total_stock || 0} Porsi
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-[#D73A49]/15 text-[#FF6B7A]">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Stok Kritis (≤ 5 Porsi)
                            </span>
                            <span className="text-2xl font-bold text-[#FF6B7A]">
                                {stats.low_stock || 0} Minuman
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {['Semua', ...categories].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    categoryFilter === cat
                                        ? 'bg-[#F6851B] text-white shadow-[0_4px_12px_rgba(246,133,27,0.3)]'
                                        : 'bg-[#181A1D] text-[#8F96A0] hover:text-white border border-[#2B2F36]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[260px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F96A0]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau deskripsi..."
                            className="w-full pl-9 pr-4 py-2 bg-[#181A1D] border border-[#2B2F36] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none"
                        />
                    </div>
                </div>

                {/* Drinks Grid */}
                {filteredDrinks.length === 0 ? (
                    <Card className="text-center py-16">
                        <Coffee className="w-12 h-12 text-[#5A606A] mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-white">Belum ada menu minuman</h3>
                        <p className="text-xs text-[#8F96A0] mt-1">
                            Klik tombol "Tambah Minuman Baru" untuk menginputkan data minuman pertama Anda.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredDrinks.map((drink) => {
                            const isOutOfStock = drink.stock <= 0;
                            const isLowStock = drink.stock > 0 && drink.stock <= 5;

                            return (
                                <Card
                                    key={drink.id}
                                    className="p-4 bg-[#181A1D] border-[#2A2E35] flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image & Badges */}
                                        <div className="relative aspect-video w-full bg-[#121416] rounded-xl overflow-hidden mb-3">
                                            {drink.image_url ? (
                                                <img
                                                    src={drink.image_url}
                                                    alt={drink.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#5A606A]">
                                                    <Coffee className="w-10 h-10" />
                                                </div>
                                            )}

                                            <div className="absolute top-2 left-2">
                                                <Badge variant="neutral" size="xs" className="backdrop-blur-md bg-black/60">
                                                    {drink.category}
                                                </Badge>
                                            </div>

                                            <div className="absolute top-2 right-2">
                                                {isOutOfStock ? (
                                                    <Badge variant="danger" size="xs">Habis</Badge>
                                                ) : isLowStock ? (
                                                    <Badge variant="warning" size="xs">Kritis ({drink.stock})</Badge>
                                                ) : (
                                                    <Badge variant="success" size="xs">{drink.stock} Unit</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-white text-sm line-clamp-1">{drink.name}</h3>
                                        <p className="text-xs text-[#8F96A0] mt-1 line-clamp-2 min-h-[32px]">
                                            {drink.description || 'Tidak ada deskripsi.'}
                                        </p>
                                        <div className="text-base font-bold text-[#F6851B] mt-2">
                                            {drink.formatted_price}
                                        </div>
                                    </div>

                                    {/* Quick Stock Controls & Actions */}
                                    <div className="pt-3 mt-3 border-t border-[#262A30] space-y-3">
                                        {/* Quick Stock Stepper */}
                                        <div className="flex items-center justify-between bg-[#121416] border border-[#2B2F36] rounded-xl p-1.5 text-xs">
                                            <span className="text-[11px] text-[#8F96A0] pl-2 font-medium">
                                                Atur Stok:
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled={drink.stock <= 0 || quickStockUpdating === drink.id}
                                                    onClick={() => handleQuickStockChange(drink, -1)}
                                                    className="w-6 h-6 rounded-lg bg-[#1E2126] hover:bg-[#2A2E35] text-white flex items-center justify-center disabled:opacity-30"
                                                    title="Kurangi stok 1"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold text-white">
                                                    {drink.stock}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={quickStockUpdating === drink.id}
                                                    onClick={() => handleQuickStockChange(drink, 1)}
                                                    className="w-6 h-6 rounded-lg bg-[#1E2126] hover:bg-[#2A2E35] text-white flex items-center justify-center disabled:opacity-30"
                                                    title="Tambah stok 1"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Edit / Delete Buttons */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleOpenEdit(drink)}
                                                className="flex-1 text-xs"
                                            >
                                                <Edit2 className="w-3.5 h-3.5 text-[#BBC0C5]" />
                                                <span>Edit</span>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingDrink(drink)}
                                                className="text-[#8F96A0] hover:text-[#FF6B7A] p-2"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Tambah Minuman */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Menu Minuman Baru"
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
                    <div>
                        <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                            Nama Minuman <span className="text-[#FF6B7A]">*</span>
                        </label>
                        <input
                            type="text"
                            value={addForm.data.name}
                            onChange={(e) => addForm.setData('name', e.target.value)}
                            placeholder="Contoh: Web3 Vanilla Latte"
                            required
                            className="w-full px-3.5 py-2.5 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-sm outline-none"
                        />
                        {addForm.errors.name && (
                            <p className="text-xs text-[#FF6B7A] mt-1">{addForm.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                Kategori
                            </label>
                            <input
                                type="text"
                                value={addForm.data.category}
                                onChange={(e) => addForm.setData('category', e.target.value)}
                                placeholder="Signature / Kopi"
                                className="w-full px-3 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                Harga (Rp) <span className="text-[#FF6B7A]">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={addForm.data.price}
                                onChange={(e) => addForm.setData('price', e.target.value)}
                                placeholder="25000"
                                required
                                className="w-full px-3 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                Stok Awal <span className="text-[#FF6B7A]">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={addForm.data.stock}
                                onChange={(e) => addForm.setData('stock', e.target.value)}
                                placeholder="20"
                                required
                                className="w-full px-3 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                            URL Gambar Minuman (Opsional)
                        </label>
                        <input
                            type="url"
                            value={addForm.data.image_url}
                            onChange={(e) => addForm.setData('image_url', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3.5 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                            Atau Unggah Berkas Foto
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => addForm.setData('image', e.target.files[0])}
                            className="w-full text-xs text-[#8F96A0] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1E2126] file:text-white hover:file:bg-[#2A2E35]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                            Deskripsi Minuman
                        </label>
                        <textarea
                            rows={3}
                            value={addForm.data.description}
                            onChange={(e) => addForm.setData('description', e.target.value)}
                            placeholder="Tuliskan komposisi atau keunggulan rasa minuman..."
                            className="w-full px-3.5 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-[#262A30]">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={addForm.processing}
                            className="flex-1 font-bold shadow-[0_4px_16px_rgba(246,133,27,0.35)]"
                        >
                            {addForm.processing ? 'Menyimpan...' : 'Simpan Minuman'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Minuman */}
            <Modal
                isOpen={!!editingDrink}
                onClose={() => setEditingDrink(null)}
                title="Edit Data Minuman"
                maxWidth="max-w-lg"
            >
                {editingDrink && (
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                Nama Minuman <span className="text-[#FF6B7A]">*</span>
                            </label>
                            <input
                                type="text"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white text-sm outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                    Kategori
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.category}
                                    onChange={(e) => editForm.setData('category', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white text-xs outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                    Harga (Rp) <span className="text-[#FF6B7A]">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.data.price}
                                    onChange={(e) => editForm.setData('price', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white text-xs outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                    Stok Fisik <span className="text-[#FF6B7A]">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.data.stock}
                                    onChange={(e) => editForm.setData('stock', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white text-xs outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                URL Gambar Baru
                            </label>
                            <input
                                type="url"
                                value={editForm.data.image_url}
                                onChange={(e) => editForm.setData('image_url', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3.5 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white text-xs outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                Atau Ganti Berkas Foto
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('image', e.target.files[0])}
                                className="w-full text-xs text-[#8F96A0] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1E2126] file:text-white hover:file:bg-[#2A2E35]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#BBC0C5] mb-1">
                                Deskripsi Minuman
                            </label>
                            <textarea
                                rows={3}
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                className="w-full px-3.5 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white text-xs outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs text-[#BBC0C5] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editForm.data.is_active}
                                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    className="rounded border-[#2F343C] bg-[#121416] text-[#F6851B] focus:ring-0"
                                />
                                <span>Tampilkan menu ini di katalog publik</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-[#262A30]">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setEditingDrink(null)}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={editForm.processing}
                                className="flex-1 font-bold shadow-[0_4px_16px_rgba(246,133,27,0.35)]"
                            >
                                {editForm.processing ? 'Menyimpan...' : 'Perbarui Minuman'}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal Hapus Minuman */}
            <Modal
                isOpen={!!deletingDrink}
                onClose={() => setDeletingDrink(null)}
                title="Hapus Menu Minuman"
                maxWidth="max-w-md"
            >
                {deletingDrink && (
                    <div className="space-y-4 py-2">
                        <p className="text-xs text-[#BBC0C5]">
                            Apakah Anda yakin ingin menghapus <strong className="text-white">{deletingDrink.name}</strong> dari daftar menu? Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="flex items-center gap-3 pt-3 border-t border-[#262A30]">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setDeletingDrink(null)}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="danger"
                                size="md"
                                onClick={handleDeleteSubmit}
                                className="flex-1 font-bold"
                            >
                                Hapus Sekarang
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
