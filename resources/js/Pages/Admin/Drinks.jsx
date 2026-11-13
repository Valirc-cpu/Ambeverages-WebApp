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
    Flame
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
                        <h1 className="text-3xl font-extrabold text-[#121417] tracking-tight flex items-center gap-2.5">
                            <Coffee className="w-7 h-7 text-[#FA4B00]" />
                            <span>Katalog & Stok Minuman</span>
                        </h1>
                        <p className="text-xs text-[#6B7280] mt-1 font-medium">
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
                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#FFF3EB] text-[#FA4B00]">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Varian Menu
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417]">
                                {stats.total_drinks || 0} Minuman
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#E8F8EE] text-[#1EBE5D]">
                            <Boxes className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Unit Stok
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417]">
                                {stats.total_stock || 0} Porsi
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#FEE2E2] text-[#D73A49]">
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
                    <div className="inline-flex items-center gap-1 bg-[#ECEFF2] p-1.5 rounded-full border border-[#DCE0E5] overflow-x-auto scrollbar-none">
                        {['Semua', ...categories].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                    categoryFilter === cat
                                        ? 'bg-[#121417] text-white shadow-md'
                                        : 'text-[#6B7280] hover:text-[#121417]'
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
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DCE0E5] focus:border-[#FA4B00] rounded-full text-[#121417] placeholder-[#9CA3AF] text-xs outline-none shadow-sm"
                        />
                    </div>
                </div>

                {/* Drinks Grid */}
                {filteredDrinks.length === 0 ? (
                    <Card className="text-center py-20 bg-white">
                        <Coffee className="w-14 h-14 text-[#CBD2D9] mx-auto mb-3" />
                        <h3 className="text-base font-bold text-[#121417]">Belum ada menu minuman</h3>
                        <p className="text-xs text-[#6B7280] mt-1">
                            Klik tombol "Tambah Minuman Baru" untuk menginputkan data minuman pertama Anda.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDrinks.map((drink) => {
                            const isOutOfStock = drink.stock <= 0;
                            const isLowStock = drink.stock > 0 && drink.stock <= 5;

                            return (
                                <div
                                    key={drink.id}
                                    className="p-5 bg-white border border-[#E5E8EC] rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image & Badges */}
                                        <div className="relative aspect-video w-full bg-[#F2F4F7] rounded-[20px] overflow-hidden mb-3.5">
                                            {drink.image_url ? (
                                                <img
                                                    src={drink.image_url}
                                                    alt={drink.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                                                    <Coffee className="w-10 h-10" />
                                                </div>
                                            )}

                                            <div className="absolute top-2.5 left-2.5">
                                                <Badge variant="dark" size="xs" className="bg-[#121417]/80 backdrop-blur-md">
                                                    {drink.category}
                                                </Badge>
                                            </div>

                                            <div className="absolute top-2.5 right-2.5">
                                                {isOutOfStock ? (
                                                    <Badge variant="danger" size="xs">Habis</Badge>
                                                ) : isLowStock ? (
                                                    <Badge variant="warning" size="xs">Kritis ({drink.stock})</Badge>
                                                ) : (
                                                    <Badge variant="success" size="xs">{drink.stock} Unit</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="font-extrabold text-[#121417] text-sm line-clamp-1">{drink.name}</h3>
                                        <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
                                            {drink.description || 'Tidak ada deskripsi.'}
                                        </p>
                                        <div className="text-base font-extrabold text-[#FA4B00] mt-2">
                                            {drink.formatted_price}
                                        </div>
                                    </div>

                                    {/* Quick Stock Controls & Actions */}
                                    <div className="pt-3.5 mt-3.5 border-t border-[#F0F2F5] space-y-3">
                                        {/* Quick Stock Stepper */}
                                        <div className="flex items-center justify-between bg-[#F7F8FA] border border-[#E5E8EC] rounded-full p-1 text-xs">
                                            <span className="text-[11px] font-bold text-[#6B7280] pl-2.5">
                                                Stok Fisik:
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled={drink.stock <= 0 || quickStockUpdating === drink.id}
                                                    onClick={() => handleQuickStockChange(drink, -1)}
                                                    className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 text-[#121417] font-bold flex items-center justify-center border border-[#DCE0E5] shadow-xs disabled:opacity-30"
                                                    title="Kurangi stok 1"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-extrabold text-[#121417]">
                                                    {drink.stock}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={quickStockUpdating === drink.id}
                                                    onClick={() => handleQuickStockChange(drink, 1)}
                                                    className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 text-[#121417] font-bold flex items-center justify-center border border-[#DCE0E5] shadow-xs disabled:opacity-30"
                                                    title="Tambah stok 1"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Edit / Delete Buttons */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenEdit(drink)}
                                                className="flex-1 text-xs font-bold"
                                            >
                                                <Edit2 className="w-3.5 h-3.5 text-[#6B7280]" />
                                                <span>Edit</span>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingDrink(drink)}
                                                className="text-[#9CA3AF] hover:text-[#D73A49] p-2"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
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
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            Nama Minuman <span className="text-[#D73A49]">*</span>
                        </label>
                        <input
                            type="text"
                            value={addForm.data.name}
                            onChange={(e) => addForm.setData('name', e.target.value)}
                            placeholder="Contoh: MetaMask Nitro Cold Brew"
                            required
                            className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-sm outline-none"
                        />
                        {addForm.errors.name && (
                            <p className="text-xs text-[#D73A49] mt-1">{addForm.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Kategori
                            </label>
                            <input
                                type="text"
                                value={addForm.data.category}
                                onChange={(e) => addForm.setData('category', e.target.value)}
                                placeholder="Signature / Kopi"
                                className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Harga (Rp) <span className="text-[#D73A49]">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={addForm.data.price}
                                onChange={(e) => addForm.setData('price', e.target.value)}
                                placeholder="25000"
                                required
                                className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Stok Awal <span className="text-[#D73A49]">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={addForm.data.stock}
                                onChange={(e) => addForm.setData('stock', e.target.value)}
                                placeholder="20"
                                required
                                className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            URL Gambar Minuman (Opsional)
                        </label>
                        <input
                            type="url"
                            value={addForm.data.image_url}
                            onChange={(e) => addForm.setData('image_url', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            Atau Unggah Berkas Gambar
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => addForm.setData('image', e.target.files[0])}
                            className="w-full text-xs text-[#6B7280] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#121417] file:text-white hover:file:bg-[#2A2E35]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            Deskripsi Minuman
                        </label>
                        <textarea
                            rows={3}
                            value={addForm.data.description}
                            onChange={(e) => addForm.setData('description', e.target.value)}
                            placeholder="Tuliskan komposisi rasa atau keunggulan menu..."
                            className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-[#F0F2F5]">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="orange"
                            size="md"
                            disabled={addForm.processing}
                            className="flex-1 font-bold shadow-[0_4px_16px_rgba(250,75,0,0.3)]"
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
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Nama Minuman <span className="text-[#D73A49]">*</span>
                            </label>
                            <input
                                type="text"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-sm outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                    Kategori
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.category}
                                    onChange={(e) => editForm.setData('category', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                    Harga (Rp) <span className="text-[#D73A49]">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.data.price}
                                    onChange={(e) => editForm.setData('price', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                    Stok Fisik <span className="text-[#D73A49]">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.data.stock}
                                    onChange={(e) => editForm.setData('stock', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                URL Gambar Baru
                            </label>
                            <input
                                type="url"
                                value={editForm.data.image_url}
                                onChange={(e) => editForm.setData('image_url', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Atau Ganti Berkas Foto
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('image', e.target.files[0])}
                                className="w-full text-xs text-[#6B7280] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#121417] file:text-white hover:file:bg-[#2A2E35]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                Deskripsi Minuman
                            </label>
                            <textarea
                                rows={3}
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs text-[#4B5563] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editForm.data.is_active}
                                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    className="rounded border-[#DCE0E5] text-[#FA4B00] focus:ring-0"
                                />
                                <span className="font-semibold">Tampilkan menu ini di katalog publik</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-[#F0F2F5]">
                            <Button
                                variant="outline"
                                size="md"
                                onClick={() => setEditingDrink(null)}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="orange"
                                size="md"
                                disabled={editForm.processing}
                                className="flex-1 font-bold shadow-[0_4px_16px_rgba(250,75,0,0.3)]"
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
                        <p className="text-xs text-[#4B5563]">
                            Apakah Anda yakin ingin menghapus <strong className="text-[#121417]">{deletingDrink.name}</strong> dari daftar menu? Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="flex items-center gap-3 pt-3 border-t border-[#F0F2F5]">
                            <Button
                                variant="outline"
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
