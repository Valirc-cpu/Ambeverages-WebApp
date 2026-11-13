import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import HeroSection from '../../Components/Catalog/HeroSection';
import DrinkCard from '../../Components/Catalog/DrinkCard';
import CartModal from '../../Components/Catalog/CartModal';
import OrderSuccessModal from '../../Components/Catalog/OrderSuccessModal';
import { Coffee } from 'lucide-react';

export default function Catalog({ drinks = [], categories = [], filters = {} }) {
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
    const handleAddToCart = (drink) => {
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
    const handleUpdateQuantity = (drinkId, delta) => {
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

    const handleRemoveFromCart = (drinkId) => {
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
    const checkoutForm = useForm({
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

        checkoutForm.post('/checkout', {
            data: {
                ...checkoutForm.data,
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

            {/* Modular Hero Section */}
            <HeroSection
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

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
                        <h3 className="text-base font-bold text-[#121417]">Belum ada menu minuman</h3>
                        <p className="text-xs text-[#6B7280] mt-1">
                            Silakan tambahkan menu minuman melalui Panel Admin.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDrinks.map((drink) => (
                            <DrinkCard
                                key={drink.id}
                                drink={drink}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Modular Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                cartTotal={cartTotal}
                checkoutForm={checkoutForm}
                onCheckout={handleCheckout}
            />

            {/* Modular Order Success Modal */}
            <OrderSuccessModal
                order={successOrder}
                onClose={() => setSuccessOrder(null)}
            />

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
