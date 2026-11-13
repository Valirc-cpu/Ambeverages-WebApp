import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Button from '../../Components/Button';
import Card from '../../Components/Card';
import Badge from '../../Components/Badge';
import Modal from '../../Components/Modal';
import {
    Coffee,
    Search,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    Send,
    CheckCircle,
    Flame,
    Phone,
    User,
    ExternalLink,
    Sparkles,
    ShieldCheck,
    Check
} from 'lucide-react';

export default function Catalog({ drinks = [], categories = [], filters = {}, whatsappNumber = '' }) {
    const { flash } = usePage().props;

    // Cart state persisted in localStorage
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('metadrink_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'Semua');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [successOrder, setSuccessOrder] = useState(null);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('metadrink_cart', JSON.stringify(cart));
    }, [cart]);

    // Handle order completion from flash
    useEffect(() => {
        if (flash?.orderCreated) {
            setSuccessOrder(flash.orderCreated);
            setCart([]);
            setIsCartOpen(false);
        }
    }, [flash]);

    // Add to cart helper
    const addToCart = (drink) => {
        if (drink.stock <= 0) return;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.id === drink.id);
            if (existingIndex > -1) {
                const currentQty = prevCart[existingIndex].quantity;
                if (currentQty >= drink.stock) {
                    alert(`Maaf, stok ${drink.name} yang tersedia hanya ${drink.stock} porsi.`);
                    return prevCart;
                }
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: currentQty + 1,
                };
                return updated;
            } else {
                return [
                    ...prevCart,
                    {
                        id: drink.id,
                        name: drink.name,
                        price: drink.price,
                        formatted_price: drink.formatted_price,
                        image_url: drink.image_url,
                        stock: drink.stock,
                        quantity: 1,
                    },
                ];
            }
        });
        setIsCartOpen(true);
    };

    // Update quantity
    const updateQuantity = (drinkId, delta) => {
        setCart((prevCart) => {
            return prevCart
                .map((item) => {
                    if (item.id === drinkId) {
                        const newQty = item.quantity + delta;
                        if (newQty > item.stock) {
                            alert(`Jumlah pesanan tidak dapat melebihi stok yang ada (${item.stock} porsi).`);
                            return item;
                        }
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean);
        });
    };

    const removeFromCart = (drinkId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== drinkId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Filter drinks
    const filteredDrinks = drinks.filter((drink) => {
        const matchesCategory =
            selectedCategory === 'Semua' || drink.category === selectedCategory;
        const matchesSearch =
            drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (drink.description && drink.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Form checkout
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        notes: '',
        items: [],
    });

    const handleCheckout = (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const payloadItems = cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }));

        post('/checkout', {
            data: {
                ...data,
                items: payloadItems,
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#121417] flex flex-col font-sans selection:bg-[#FA4B00] selection:text-white">
            <Head title="MetaMask Brew - Artisanal Coffee & Drinks" />

            {/* Navbar */}
            <Navbar onOpenCart={() => setIsCartOpen(true)} cartItemCount={cartItemCount} />

            {/* Hero Section styled like metamask.com/download */}
            <section className="relative overflow-hidden pt-12 pb-16 bg-white border-b border-[#E5E8EC]">
                {/* Soft ambient blurs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FA4B00]/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#B9F24B]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Eyebrow Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3EB] border border-[#FA4B00]/25 text-[#FA4B00] text-xs font-bold uppercase tracking-wider mb-5">
                        <Flame className="w-4 h-4 fill-[#FA4B00]" />
                        <span>Artisanal Coffee & Beverage Store</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-[#121417] tracking-tight mb-5 max-w-3xl mx-auto leading-[1.12]">
                        Crafted Drinks for <br className="hidden sm:inline" />
                        <span className="text-[#FA4B00]">Web3 Enthusiasts.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                        Pesan minuman favorit Anda tanpa registrasi akun. Rincian pesanan otomatis tersambung ke WhatsApp admin dan stok akan terpotong seketika dikonfirmasi.
                    </p>

                    {/* MetaMask Segmented Capsule Pill Tabs */}
                    <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-full bg-[#ECEFF2] border border-[#DCE0E5] shadow-inner max-w-full overflow-x-auto gap-1 mb-8">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('Semua')}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                selectedCategory === 'Semua'
                                    ? 'bg-[#121417] text-white shadow-md'
                                    : 'text-[#6B7280] hover:text-[#121417]'
                            }`}
                        >
                            Semua Menu
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                    selectedCategory === cat
                                        ? 'bg-[#121417] text-white shadow-md'
                                        : 'text-[#6B7280] hover:text-[#121417]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Pill Bar */}
                    <div className="max-w-md mx-auto relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari menu kopi, matcha, tea..."
                            className="w-full pl-12 pr-4 py-3 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-full text-[#121417] placeholder-[#9CA3AF] text-sm transition-all outline-none shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Menu Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#121417] tracking-tight flex items-center gap-2.5">
                            <span>Katalog Menu Pilihan</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-[#ECEFF2] text-[#4B5563] font-bold">
                                {filteredDrinks.length} Varian
                            </span>
                        </h2>
                        <p className="text-xs text-[#6B7280] mt-1 font-medium">
                            Ketersediaan stok realtime dari gudang MetaDrink
                        </p>
                    </div>
                </div>

                {filteredDrinks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-[#E5E8EC] shadow-sm">
                        <Coffee className="w-14 h-14 text-[#9CA3AF] mx-auto mb-3" />
                        <h3 className="text-base font-bold text-[#121417]">Menu tidak ditemukan</h3>
                        <p className="text-xs text-[#6B7280] mt-1">
                            Silakan coba kata kunci lain atau pilih tab kategori di atas.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDrinks.map((drink) => {
                            const isOutOfStock = drink.stock <= 0;
                            const isLowStock = drink.stock > 0 && drink.stock <= 5;

                            return (
                                <div
                                    key={drink.id}
                                    className="bg-white border border-[#E5E8EC] rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Beverage Image */}
                                        <div className="relative aspect-[4/3] w-full bg-[#F2F4F7] rounded-[20px] overflow-hidden mb-4">
                                            {drink.image_url ? (
                                                <img
                                                    src={drink.image_url}
                                                    alt={drink.name}
                                                    className={`w-full h-full object-cover transition-transform duration-300 ${
                                                        isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'
                                                    }`}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                                                    <Coffee className="w-12 h-12 mb-1" />
                                                    <span className="text-xs font-semibold">MetaDrink</span>
                                                </div>
                                            )}

                                            {/* Category Tag Pill */}
                                            <div className="absolute top-3 left-3">
                                                <Badge variant="dark" size="xs" className="bg-[#121417]/85 backdrop-blur-md">
                                                    {drink.category}
                                                </Badge>
                                            </div>

                                            {/* Stock Indicator Badge */}
                                            <div className="absolute top-3 right-3">
                                                {isOutOfStock ? (
                                                    <Badge variant="danger" size="xs">
                                                        Stok Habis
                                                    </Badge>
                                                ) : isLowStock ? (
                                                    <Badge variant="warning" size="xs">
                                                        Sisa {drink.stock}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="success" size="xs">
                                                        {drink.stock} Tersedia
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Drink Information */}
                                        <h3 className="font-extrabold text-base text-[#121417] group-hover:text-[#FA4B00] transition-colors line-clamp-1">
                                            {drink.name}
                                        </h3>
                                        <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2 min-h-[32px] font-normal leading-relaxed">
                                            {drink.description || 'Minuman segar diracik khusus untuk menemani aktivitas harian Anda.'}
                                        </p>
                                    </div>

                                    {/* Price & Action Row */}
                                    <div className="pt-4 mt-4 border-t border-[#F0F2F5] flex items-center justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                                Harga
                                            </span>
                                            <span className="text-lg font-extrabold text-[#121417]">
                                                {drink.formatted_price}
                                            </span>
                                        </div>

                                        <Button
                                            variant={isOutOfStock ? 'secondary' : 'orange'}
                                            size="sm"
                                            disabled={isOutOfStock}
                                            onClick={() => addToCart(drink)}
                                            className="shrink-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>{isOutOfStock ? 'Habis' : 'Pesan'}</span>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Cart Slide-Over / Modal */}
            <Modal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                title="Keranjang Pesanan"
                maxWidth="max-w-xl"
            >
                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-14 h-14 text-[#CBD2D9] mx-auto mb-3" />
                        <p className="text-base font-bold text-[#121417]">Keranjang Anda masih kosong</p>
                        <p className="text-xs text-[#6B7280] mt-1">
                            Pilih minuman favorit Anda dari menu untuk memulai pesanan.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC]"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-xl object-cover bg-gray-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                                <Coffee className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div className="truncate">
                                            <h4 className="text-sm font-bold text-[#121417] truncate">{item.name}</h4>
                                            <span className="text-xs text-[#FA4B00] font-extrabold">{item.formatted_price}</span>
                                        </div>
                                    </div>

                                    {/* Stepper Controls */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center bg-white border border-[#DCE0E5] rounded-full p-1 shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 text-[#6B7280] hover:text-[#121417] transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-2.5 text-xs font-extrabold text-[#121417] min-w-[20px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 text-[#6B7280] hover:text-[#121417] transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[#9CA3AF] hover:text-[#D73A49] p-1.5 transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Subtotal */}
                        <div className="p-4 rounded-2xl bg-[#FFF3EB] border border-[#FA4B00]/25 flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#121417]">Total Tagihan Pesanan:</span>
                            <span className="text-xl font-extrabold text-[#FA4B00]">
                                Rp {new Intl.NumberFormat('id-ID').format(cartTotal)}
                            </span>
                        </div>

                        {/* Customer Form */}
                        <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-[#F0F2F5]">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#FA4B00]" />
                                <span>Data Pemesan (Guest / Tanpa Akun)</span>
                            </h4>

                            <div>
                                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                    Nama Lengkap <span className="text-[#D73A49]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm outline-none transition-colors"
                                />
                                {errors.customer_name && (
                                    <p className="text-xs text-[#D73A49] mt-1">{errors.customer_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                    Nomor WhatsApp (Aktif) <span className="text-[#D73A49]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    placeholder="Contoh: 08123456789"
                                    required
                                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm outline-none transition-colors"
                                />
                                <span className="text-[11px] text-[#6B7280] mt-1 block">
                                    Admin akan memverifikasi dan mengonfirmasi pesanan ke nomor ini
                                </span>
                                {errors.customer_phone && (
                                    <p className="text-xs text-[#D73A49] mt-1">{errors.customer_phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Es dipisah, less sugar..."
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] focus:bg-white rounded-xl text-[#121417] placeholder-[#9CA3AF] text-sm outline-none resize-none transition-colors"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="whatsapp"
                                size="lg"
                                disabled={processing}
                                className="w-full font-bold shadow-[0_6px_20px_rgba(37,211,102,0.35)]"
                            >
                                <Send className="w-4 h-4" />
                                <span>{processing ? 'Menyiapkan Pesanan...' : 'Pesan Sekarang via WhatsApp'}</span>
                            </Button>
                        </form>
                    </div>
                )}
            </Modal>

            {/* Order Created Success Modal */}
            <Modal
                isOpen={!!successOrder}
                onClose={() => setSuccessOrder(null)}
                title="Pesanan Berhasil Dibuat!"
                maxWidth="max-w-md"
            >
                {successOrder && (
                    <div className="text-center py-4 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#B9F24B] border border-[#A5DD3C] text-[#121417] flex items-center justify-center mx-auto shadow-md">
                            <Check className="w-8 h-8 stroke-[3]" />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-[#121417]">Siap Terhubung ke WhatsApp</h3>
                            <p className="text-xs text-[#6B7280] mt-1 font-medium">
                                Kode pesanan Anda telah dibuat dengan status <span className="font-bold text-[#FA4B00]">Menunggu Konfirmasi</span>.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC] text-left space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#6B7280] font-medium">Kode Order:</span>
                                <span className="font-mono font-bold text-[#FA4B00]">{successOrder.order_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6B7280] font-medium">Nama Pemesan:</span>
                                <span className="font-bold text-[#121417]">{successOrder.customer_name}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#E5E8EC] pt-2 text-sm">
                                <span className="font-bold text-[#121417]">Total Pembayaran:</span>
                                <span className="font-extrabold text-[#FA4B00]">{successOrder.total_price}</span>
                            </div>
                        </div>

                        <p className="text-xs text-[#6B7280] leading-relaxed">
                            Klik tombol di bawah ini untuk membuka WhatsApp dan mengirim rincian order ke admin toko.
                        </p>

                        <div className="space-y-2 pt-2">
                            <a
                                href={successOrder.whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Buka Chat WhatsApp Admin</span>
                            </a>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSuccessOrder(null)}
                                className="w-full text-xs text-[#6B7280] hover:text-[#121417]"
                            >
                                Tutup Jendela Ini
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Footer */}
            <footer className="border-t border-[#E5E8EC] py-10 bg-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#6B7280] space-y-2">
                    <p className="font-semibold text-[#121417]">MetaMask Brew © {new Date().getFullYear()} — Handcrafted Beverages</p>
                    <p>Designed with MetaMask Design System tokens, Laravel 13, React, and Tailwind CSS.</p>
                </div>
            </footer>
        </div>
    );
}
