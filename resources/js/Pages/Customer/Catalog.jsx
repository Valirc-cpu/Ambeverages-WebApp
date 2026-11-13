import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
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
    Sparkles,
    Flame,
    Phone,
    User,
    FileText,
    ArrowRight,
    ExternalLink
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
            onError: (err) => {
                console.error(err);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#121416] text-[#F2F4F6] flex flex-col selection:bg-[#F6851B] selection:text-white">
            <Head title="Katalog Minuman Segar & Spesial" />

            {/* Navbar */}
            <Navbar onOpenCart={() => setIsCartOpen(true)} cartItemCount={cartItemCount} />

            {/* Hero Section with MetaMask styling */}
            <section className="relative overflow-hidden pt-12 pb-14 border-b border-[#25282D]">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F6851B]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#037DD6]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6851B]/15 border border-[#F6851B]/30 text-[#F6851B] text-xs font-semibold mb-4">
                        <Flame className="w-3.5 h-3.5 fill-[#F6851B]" />
                        <span>Kopi & Minuman Signature Terbaik</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 max-w-2xl mx-auto leading-tight">
                        Cita Rasa Autentik, <br />
                        <span className="bg-gradient-to-r from-[#F6851B] via-[#FFA447] to-[#FFD099] bg-clip-text text-transparent">
                            Pesan Mudah via WhatsApp
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base text-[#8F96A0] max-w-xl mx-auto mb-8">
                        Pilih menu favorit Anda tanpa perlu repot registrasi akun. Pesanan dicatat di sistem dan dikonfirmasi langsung dengan admin via WhatsApp.
                    </p>

                    {/* Search & Categories Bar */}
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8F96A0]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari minuman favorit (cth: Mocha, Latte, Cold Brew)..."
                                className="w-full pl-12 pr-4 py-3.5 bg-[#181A1D] border border-[#2B2F36] focus:border-[#F6851B] focus:ring-1 focus:ring-[#F6851B] rounded-2xl text-white placeholder-[#5A606A] text-sm shadow-inner transition-colors outline-none"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('Semua')}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === 'Semua'
                                        ? 'bg-[#F6851B] text-white shadow-[0_4px_12px_rgba(246,133,27,0.3)]'
                                        : 'bg-[#1C1E22] text-[#8F96A0] hover:text-white hover:bg-[#25282E] border border-[#2B2F36]'
                                }`}
                            >
                                Semua Menu
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-[#F6851B] text-white shadow-[0_4px_12px_rgba(246,133,27,0.3)]'
                                            : 'bg-[#1C1E22] text-[#8F96A0] hover:text-white hover:bg-[#25282E] border border-[#2B2F36]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <span>Daftar Menu Tersedia</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1C1E22] border border-[#2B2F36] text-[#8F96A0]">
                                {filteredDrinks.length} minuman
                            </span>
                        </h2>
                        <p className="text-xs text-[#8F96A0] mt-0.5">
                            Stok real-time selalu terupdate otomatis setiap konfirmasi pembelian
                        </p>
                    </div>
                </div>

                {filteredDrinks.length === 0 ? (
                    <div className="text-center py-20 bg-[#16181B] rounded-3xl border border-[#25282D]">
                        <Coffee className="w-12 h-12 text-[#5A606A] mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-white">Minuman tidak ditemukan</h3>
                        <p className="text-xs text-[#8F96A0] mt-1">
                            Coba ubah kata kunci pencarian atau pilih kategori lain.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDrinks.map((drink) => {
                            const isOutOfStock = drink.stock <= 0;
                            const isLowStock = drink.stock > 0 && drink.stock <= 5;

                            return (
                                <Card
                                    key={drink.id}
                                    hover={!isOutOfStock}
                                    className="flex flex-col justify-between overflow-hidden p-0 bg-[#181A1D] border-[#2A2E35] group"
                                >
                                    {/* Drink Image */}
                                    <div className="relative aspect-[4/3] w-full bg-[#121416] overflow-hidden">
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
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#5A606A]">
                                                <Coffee className="w-12 h-12 mb-1" />
                                                <span className="text-[11px]">Foto Minuman</span>
                                            </div>
                                        )}

                                        {/* Category Badge on top of image */}
                                        <div className="absolute top-3 left-3">
                                            <Badge variant="neutral" size="xs" className="backdrop-blur-md bg-black/60 border-white/10">
                                                {drink.category}
                                            </Badge>
                                        </div>

                                        {/* Stock indicator badge */}
                                        <div className="absolute top-3 right-3">
                                            {isOutOfStock ? (
                                                <Badge variant="danger" size="xs">
                                                    Stok Habis
                                                </Badge>
                                            ) : isLowStock ? (
                                                <Badge variant="warning" size="xs">
                                                    Sisa {drink.stock} unit
                                                </Badge>
                                            ) : (
                                                <Badge variant="success" size="xs">
                                                    Tersedia ({drink.stock})
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Drink Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-base text-white group-hover:text-[#F6851B] transition-colors line-clamp-1">
                                                {drink.name}
                                            </h3>
                                            <p className="text-xs text-[#8F96A0] mt-1 line-clamp-2 min-h-[32px]">
                                                {drink.description || 'Minuman segar diracik khusus untuk menyegarkan harimu.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-[#262A30] flex items-center justify-between gap-3">
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-[#8F96A0] block">
                                                    Harga
                                                </span>
                                                <span className="text-base font-bold text-white">
                                                    {drink.formatted_price}
                                                </span>
                                            </div>

                                            <Button
                                                variant={isOutOfStock ? 'secondary' : 'primary'}
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
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Cart Slide-Over / Modal */}
            <Modal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                title="Keranjang Pesanan Anda"
                maxWidth="max-w-xl"
            >
                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <ShoppingBag className="w-12 h-12 text-[#5A606A] mx-auto mb-3" />
                        <p className="text-sm font-semibold text-white">Keranjang belanja Anda masih kosong</p>
                        <p className="text-xs text-[#8F96A0] mt-1">
                            Silakan pilih minuman dari menu di atas terlebih dahulu.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#1A1D21] border border-[#2B2F36]"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover bg-black shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-[#121416] flex items-center justify-center text-[#5A606A] shrink-0">
                                                <Coffee className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div className="truncate">
                                            <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                                            <span className="text-xs text-[#F6851B] font-medium">{item.formatted_price}</span>
                                        </div>
                                    </div>

                                    {/* Stepper Controls */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center bg-[#121416] border border-[#2B2F36] rounded-lg p-0.5">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 text-[#8F96A0] hover:text-white transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 text-[#8F96A0] hover:text-white transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[#8F96A0] hover:text-[#FF6B7A] p-1 transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Subtotal */}
                        <div className="p-4 rounded-2xl bg-[#1A1D21] border border-[#2B2F36] flex items-center justify-between">
                            <span className="text-sm text-[#BBC0C5]">Total Estimasi Pembayaran:</span>
                            <span className="text-lg font-bold text-[#F6851B]">
                                Rp {new Intl.NumberFormat('id-ID').format(cartTotal)}
                            </span>
                        </div>

                        {/* Customer Form */}
                        <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-[#262A30]">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#BBC0C5] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#F6851B]" />
                                <span>Informasi Pemesan (Tanpa Login)</span>
                            </h4>

                            <div>
                                <label className="block text-xs font-semibold text-[#8F96A0] mb-1">
                                    Nama Lengkap <span className="text-[#FF6B7A]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="Contoh: Budi Pratama"
                                    required
                                    className="w-full px-3.5 py-2.5 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-sm outline-none"
                                />
                                {errors.customer_name && (
                                    <p className="text-xs text-[#FF6B7A] mt-1">{errors.customer_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#8F96A0] mb-1">
                                    Nomor WhatsApp (Aktif) <span className="text-[#FF6B7A]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        placeholder="Contoh: 08123456789"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-sm outline-none"
                                    />
                                </div>
                                <span className="text-[11px] text-[#5A606A] mt-0.5 block">
                                    Digunakan untuk verifikasi order dan konfirmasi pesanan dengan admin
                                </span>
                                {errors.customer_phone && (
                                    <p className="text-xs text-[#FF6B7A] mt-1">{errors.customer_phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#8F96A0] mb-1">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Es dipisah, gulanya sedikit saja ya kak..."
                                    rows={2}
                                    className="w-full px-3.5 py-2 bg-[#121416] border border-[#2F343C] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-sm outline-none resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={processing}
                                className="w-full font-bold shadow-[0_4px_20px_rgba(246,133,27,0.35)]"
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
                title="Pesanan Berhasil Disiapkan!"
                maxWidth="max-w-md"
            >
                {successOrder && (
                    <div className="text-center py-4 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#28A745]/15 border border-[#28A745]/30 text-[#48D168] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(40,167,69,0.2)]">
                            <CheckCircle className="w-8 h-8" />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white">Siap Dikirim ke WhatsApp!</h3>
                            <p className="text-xs text-[#8F96A0] mt-1">
                                Data pesanan Anda telah tersimpan dengan status <span className="text-[#FFC453] font-semibold">Menunggu Konfirmasi</span>.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#1A1D21] border border-[#2B2F36] text-left space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#8F96A0]">Kode Pesanan:</span>
                                <span className="font-mono font-bold text-[#F6851B]">{successOrder.order_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#8F96A0]">Nama Pemesan:</span>
                                <span className="font-semibold text-white">{successOrder.customer_name}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#262A30] pt-2 text-sm">
                                <span className="text-white font-medium">Total Tagihan:</span>
                                <span className="font-bold text-white">{successOrder.total_price}</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-[#8F96A0] leading-relaxed">
                            Klik tombol di bawah ini untuk membuka WhatsApp dan mengirim rincian pesanan ke admin toko kami.
                        </p>

                        <div className="space-y-2 pt-2">
                            <a
                                href={successOrder.whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#28A745] hover:bg-[#218838] text-white font-bold text-sm shadow-[0_4px_16px_rgba(40,167,69,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Buka Chat WhatsApp Admin</span>
                            </a>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSuccessOrder(null)}
                                className="w-full text-xs text-[#8F96A0] hover:text-white"
                            >
                                Tutup Jendela Ini
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Footer */}
            <footer className="border-t border-[#25282D] py-8 bg-[#121416] mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#5A606A]">
                    <p>© {new Date().getFullYear()} MetaDrink. Built with Laravel 13, React, Tailwind CSS, & MetaMask Design System.</p>
                </div>
            </footer>
        </div>
    );
}
