import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrinkCard from './DrinkCard';
import { MousePointer, AlertCircle } from 'lucide-react';

export default function DrinkParallaxDeck({ drinks = [], onAddToCart }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [boundaryBounce, setBoundaryBounce] = useState(null); // 'top' | 'bottom' | null
    const [boundaryFeedback, setBoundaryFeedback] = useState(null); // message string

    const sectionRef = useRef(null);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    // Safety buffer & momentum isolation refs
    const boundaryLockUntil = useRef(0);
    const accumulatedExitDelta = useRef(0);
    const feedbackTimerRef = useRef(null);
    const bounceTimerRef = useRef(null);

    const hasMultiple = drinks.length > 1;

    // Reset when category/search filter changes
    useEffect(() => {
        setActiveIndex(0);
        boundaryLockUntil.current = Date.now() + 600;
        accumulatedExitDelta.current = 0;
    }, [drinks.length]);

    // Helper to trigger boundary bounce & tactile warning
    const triggerBoundaryEffect = (type) => {
        setBoundaryBounce(type);
        if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
        bounceTimerRef.current = setTimeout(() => setBoundaryBounce(null), 350);

        const msg = type === 'bottom'
            ? 'Batas akhir menu tercapai • Gulir sekali lagi untuk lanjut ke footer'
            : 'Batas awal menu tercapai • Gulir sekali lagi untuk kembali ke atas';
        setBoundaryFeedback(msg);

        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = setTimeout(() => setBoundaryFeedback(null), 2000);
    };

    // Intercept scroll: when user scrolls over catalog, cards scroll first with robust boundary protection!
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !hasMultiple) return;

        let accumulatedDelta = 0;
        let lastStepTime = 0;

        const onWheel = (e) => {
            const now = Date.now();
            const delta = e.deltaY;

            // 1. SCROLLING DOWN (Toward next card)
            if (delta > 0) {
                // Not at last card yet: strictly absorb wheel, step card, never scroll page!
                if (activeIndexRef.current < drinks.length - 1) {
                    e.preventDefault();
                    accumulatedDelta += delta;

                    if (Math.abs(accumulatedDelta) > 28 && now - lastStepTime > 320) {
                        lastStepTime = now;
                        accumulatedDelta = 0;
                        accumulatedExitDelta.current = 0;

                        const nextIdx = activeIndexRef.current + 1;
                        setActiveIndex(nextIdx);

                        // If entering the last card, arm a 700ms momentum isolation lock
                        if (nextIdx === drinks.length - 1) {
                            boundaryLockUntil.current = now + 700;
                        }
                    }
                    return;
                }

                // Currently on the LAST CARD:
                // If within the fast-scroll momentum cooldown, ABSORB EVERYTHING and trigger bounce!
                if (now < boundaryLockUntil.current) {
                    e.preventDefault();
                    triggerBoundaryEffect('bottom');
                    return;
                }

                // If user is intentionally continuing after the cooldown:
                // Require an intentional deliberate delta threshold before allowing window scroll
                if (accumulatedExitDelta.current < 75) {
                    e.preventDefault();
                    accumulatedExitDelta.current += delta;
                    triggerBoundaryEffect('bottom');
                    return;
                }

                // Deliberate threshold satisfied -> allow natural page scroll to footer
                return;
            }

            // 2. SCROLLING UP (Toward previous card)
            if (delta < 0) {
                // Not at first card yet: strictly absorb wheel, step card, never scroll page!
                if (activeIndexRef.current > 0) {
                    e.preventDefault();
                    accumulatedDelta += delta;

                    if (Math.abs(accumulatedDelta) > 28 && now - lastStepTime > 320) {
                        lastStepTime = now;
                        accumulatedDelta = 0;
                        accumulatedExitDelta.current = 0;

                        const prevIdx = activeIndexRef.current - 1;
                        setActiveIndex(prevIdx);

                        // If entering the first card, arm a 700ms momentum isolation lock
                        if (prevIdx === 0) {
                            boundaryLockUntil.current = now + 700;
                        }
                    }
                    return;
                }

                // Currently on the FIRST CARD:
                // If within the fast-scroll momentum cooldown, ABSORB EVERYTHING and trigger bounce!
                if (now < boundaryLockUntil.current) {
                    e.preventDefault();
                    triggerBoundaryEffect('top');
                    return;
                }

                // If user is intentionally continuing after the cooldown:
                if (accumulatedExitDelta.current < 75) {
                    e.preventDefault();
                    accumulatedExitDelta.current += Math.abs(delta);
                    triggerBoundaryEffect('top');
                    return;
                }

                // Deliberate threshold satisfied -> allow natural page scroll to hero
                return;
            }
        };

        // Attach non-passive listener to reliably preventDefault
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [hasMultiple, drinks.length]);

    // Touch swipe support for mobile with matching boundary buffer
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !hasMultiple) return;

        let startY = 0;
        let lastStepTime = 0;

        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            const now = Date.now();

            // Swipe up (scroll down)
            if (diff > 35) {
                if (activeIndexRef.current < drinks.length - 1) {
                    e.preventDefault();
                    if (now - lastStepTime > 320) {
                        lastStepTime = now;
                        const nextIdx = activeIndexRef.current + 1;
                        setActiveIndex(nextIdx);
                        startY = currentY;
                        accumulatedExitDelta.current = 0;
                        if (nextIdx === drinks.length - 1) {
                            boundaryLockUntil.current = now + 650;
                        }
                    }
                } else if (now < boundaryLockUntil.current) {
                    e.preventDefault();
                    triggerBoundaryEffect('bottom');
                }
            } else if (diff < -35) {
                // Swipe down (scroll up)
                if (activeIndexRef.current > 0) {
                    e.preventDefault();
                    if (now - lastStepTime > 320) {
                        lastStepTime = now;
                        const prevIdx = activeIndexRef.current - 1;
                        setActiveIndex(prevIdx);
                        startY = currentY;
                        accumulatedExitDelta.current = 0;
                        if (prevIdx === 0) {
                            boundaryLockUntil.current = now + 650;
                        }
                    }
                } else if (now < boundaryLockUntil.current) {
                    e.preventDefault();
                    triggerBoundaryEffect('top');
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

    if (drinks.length === 0) return null;

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
        <section
            ref={sectionRef}
            className="w-full py-4 select-none relative"
            style={{ perspective: '1400px' }}
        >
            {/* Minimal Parallax Navigation Indicator with Boundary Alert */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] max-w-4xl mx-auto px-2 mb-3">
                <div className="flex items-center gap-2">
                    <MousePointer className="w-3.5 h-3.5 text-[#121417] dark:text-white" />
                    <span>Scroll pada kartu untuk menggulir menu</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Boundary Alert Chip (Non-intrusive feedback) */}
                    <AnimatePresence>
                        {boundaryFeedback && (
                            <motion.span
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121417] dark:bg-white text-white dark:text-[#121417] text-[11px] font-mono shadow-xs"
                            >
                                <AlertCircle className="w-3 h-3 text-[#FA4B00]" />
                                <span>{boundaryFeedback}</span>
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-1 font-mono">
                        <span className="font-extrabold text-[#121417] dark:text-white">
                            {String(activeIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[#9CA3AF]">/</span>
                        <span className="text-[#9CA3AF]">{String(drinks.length).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* True 3D Parallax Perspective Card Deck Stack with Elastic Boundary Bounce */}
            <motion.div
                animate={
                    boundaryBounce === 'bottom'
                        ? { y: [0, 14, -6, 0] }
                        : boundaryBounce === 'top'
                        ? { y: [0, -14, 6, 0] }
                        : { y: 0 }
                }
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="relative min-h-[460px] sm:min-h-[480px] flex flex-col items-center justify-center gap-3"
            >
                {/* 1. Previous Card (3D Receded Above) */}
                {prevDrink && (
                    <motion.div
                        key={`prev-${prevDrink.id}`}
                        initial={{ opacity: 0, y: -45, scale: 0.88, rotateX: 14 }}
                        animate={{ opacity: 0.35, y: -20, scale: 0.91, rotateX: 9 }}
                        exit={{ opacity: 0, y: -60, scale: 0.84, rotateX: 18 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.85 }}
                        onClick={() => {
                            setActiveIndex((prev) => Math.max(0, prev - 1));
                            accumulatedExitDelta.current = 0;
                        }}
                        className="w-full max-w-4xl mx-auto cursor-pointer hover:opacity-60 transition-opacity z-10"
                        title="Klik untuk kembali ke menu sebelumnya"
                    >
                        <DrinkCard
                            drink={prevDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={false}
                        />
                    </motion.div>
                )}

                {/* 2. Active Card (Prominent Center) */}
                <motion.div
                    key={`active-${currentDrink.id}`}
                    layoutId={`deck-card-${currentDrink.id}`}
                    initial={{ opacity: 0, scale: 0.93, y: 30, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1.03, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: -30, rotateX: 10 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.8 }}
                    className="w-full max-w-4xl mx-auto z-20"
                >
                    <DrinkCard
                        drink={currentDrink}
                        onAddToCart={onAddToCart}
                        isHighlighted={true}
                    />
                </motion.div>

                {/* 3. Next Card (3D Receded Below) */}
                {nextDrink && (
                    <motion.div
                        key={`next-${nextDrink.id}`}
                        initial={{ opacity: 0, y: 45, scale: 0.88, rotateX: -14 }}
                        animate={{ opacity: 0.35, y: 20, scale: 0.91, rotateX: -9 }}
                        exit={{ opacity: 0, y: 60, scale: 0.84, rotateX: -18 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.85 }}
                        onClick={() => {
                            setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1));
                            accumulatedExitDelta.current = 0;
                        }}
                        className="w-full max-w-4xl mx-auto cursor-pointer hover:opacity-60 transition-opacity z-10"
                        title="Klik untuk lanjut ke menu berikutnya"
                    >
                        <DrinkCard
                            drink={nextDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={false}
                        />
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
