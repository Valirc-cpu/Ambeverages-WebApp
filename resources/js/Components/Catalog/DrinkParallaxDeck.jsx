import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrinkCard from './DrinkCard';
import { MousePointer, ArrowDown, ArrowUp } from 'lucide-react';

export default function DrinkParallaxDeck({ drinks = [], onAddToCart }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const hasMultiple = drinks.length > 1;

    // Reset when drinks change
    useEffect(() => {
        setActiveIndex(0);
    }, [drinks.length]);

    // Wheel scroll listener: scroll down -> next card big, prev card smaller
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !hasMultiple) return;

        let lastTime = 0;

        const onWheel = (e) => {
            const now = Date.now();
            const delta = e.deltaY;

            // Cooldown throttle to make each card transition distinct and tactile
            if (now - lastTime < 360) {
                if (
                    (delta > 0 && activeIndexRef.current < drinks.length - 1) ||
                    (delta < 0 && activeIndexRef.current > 0)
                ) {
                    e.preventDefault();
                }
                return;
            }

            if (delta > 20) {
                // Scrolling DOWN
                if (activeIndexRef.current < drinks.length - 1) {
                    e.preventDefault();
                    lastTime = now;
                    setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1));
                }
            } else if (delta < -20) {
                // Scrolling UP
                if (activeIndexRef.current > 0) {
                    e.preventDefault();
                    lastTime = now;
                    setActiveIndex((prev) => Math.max(0, prev - 1));
                }
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [hasMultiple, drinks.length]);

    // Touch swipe listener for mobile
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !hasMultiple) return;

        let startY = 0;
        let lastTime = 0;

        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            const now = Date.now();
            if (now - lastTime < 360) return;

            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;

            if (Math.abs(diff) > 40) {
                if (diff > 0 && activeIndexRef.current < drinks.length - 1) {
                    e.preventDefault();
                    lastTime = now;
                    setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1));
                    startY = currentY;
                } else if (diff < 0 && activeIndexRef.current > 0) {
                    e.preventDefault();
                    lastTime = now;
                    setActiveIndex((prev) => Math.max(0, prev - 1));
                    startY = currentY;
                }
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
        };
    }, [hasMultiple, drinks.length]);

    // Keyboard navigation (ArrowDown / ArrowUp)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (!hasMultiple) return;
            if (e.key === 'ArrowDown' && activeIndexRef.current < drinks.length - 1) {
                e.preventDefault();
                setActiveIndex((prev) => prev + 1);
            } else if (e.key === 'ArrowUp' && activeIndexRef.current > 0) {
                e.preventDefault();
                setActiveIndex((prev) => prev - 1);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [hasMultiple, drinks.length]);

    if (drinks.length === 0) return null;

    // Single card fallback
    if (!hasMultiple) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <DrinkCard
                    drink={drinks[0]}
                    onAddToCart={onAddToCart}
                    isHighlighted={true}
                />
            </div>
        );
    }

    const prevDrink = activeIndex > 0 ? drinks[activeIndex - 1] : null;
    const currentDrink = drinks[activeIndex];
    const nextDrink = activeIndex < drinks.length - 1 ? drinks[activeIndex + 1] : null;

    return (
        <div ref={containerRef} className="space-y-4 py-2 select-none">
            {/* Minimal Scroll Instruction Indicator (Zero buttons) */}
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] max-w-4xl mx-auto px-2">
                <div className="flex items-center gap-2">
                    <MousePointer className="w-3.5 h-3.5 text-[#FA4B00]" />
                    <span>Scroll pada kartu untuk melihat menu berikutnya</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-mono text-[#FA4B00] font-extrabold">
                        {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span>/</span>
                    <span className="font-mono">{String(drinks.length).padStart(2, '0')} Menu</span>
                </div>
            </div>

            {/* Parallax Card Deck Stack */}
            <div className="relative min-h-[440px] sm:min-h-[460px] flex flex-col items-center justify-center gap-4 py-2">
                {/* Previous Card (Slightly Smaller, Stacked Above) */}
                {prevDrink && (
                    <motion.div
                        key={`prev-${prevDrink.id}`}
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 0.45, y: 0, scale: 0.93 }}
                        exit={{ opacity: 0, y: -30, scale: 0.88 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                        className="w-full max-w-4xl mx-auto cursor-pointer hover:opacity-70 transition-opacity"
                        title="Klik untuk kembali ke menu ini"
                    >
                        <DrinkCard
                            drink={prevDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={false}
                        />
                    </motion.div>
                )}

                {/* Active Card (Enlarged / Big / Highlighted, Center) */}
                <motion.div
                    key={`active-${currentDrink.id}`}
                    layoutId={`deck-${currentDrink.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    className="w-full max-w-4xl mx-auto z-20"
                >
                    <DrinkCard
                        drink={currentDrink}
                        onAddToCart={onAddToCart}
                        isHighlighted={true}
                    />
                </motion.div>

                {/* Next Card (Slightly Smaller, Stacked Below) */}
                {nextDrink && (
                    <motion.div
                        key={`next-${nextDrink.id}`}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 0.45, y: 0, scale: 0.93 }}
                        exit={{ opacity: 0, y: 30, scale: 0.88 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        onClick={() => setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1))}
                        className="w-full max-w-4xl mx-auto cursor-pointer hover:opacity-70 transition-opacity"
                        title="Klik untuk lanjut ke menu ini"
                    >
                        <DrinkCard
                            drink={nextDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={false}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
