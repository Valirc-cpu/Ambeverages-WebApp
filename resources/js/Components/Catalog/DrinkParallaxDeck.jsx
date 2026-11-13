import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrinkCard from './DrinkCard';

export default function DrinkParallaxDeck({ drinks = [], onAddToCart }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1: next (down), -1: prev (up)
    const [boundaryBounce, setBoundaryBounce] = useState(null); // 'top' | 'bottom' | null

    const sectionRef = useRef(null);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    // Safety buffer & momentum isolation refs
    const boundaryLockUntil = useRef(0);
    const accumulatedExitDelta = useRef(0);
    const bounceTimerRef = useRef(null);

    const hasMultiple = drinks.length > 1;

    // Reset when category/search filter changes
    useEffect(() => {
        setActiveIndex(0);
        setDirection(1);
        boundaryLockUntil.current = Date.now() + 600;
        accumulatedExitDelta.current = 0;
    }, [drinks.length]);

    // Helper to trigger boundary bounce
    const triggerBoundaryEffect = (type) => {
        setBoundaryBounce(type);
        if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
        bounceTimerRef.current = setTimeout(() => setBoundaryBounce(null), 350);
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

                    if (Math.abs(accumulatedDelta) > 26 && now - lastStepTime > 340) {
                        lastStepTime = now;
                        accumulatedDelta = 0;
                        accumulatedExitDelta.current = 0;

                        const nextIdx = activeIndexRef.current + 1;
                        setDirection(1);
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

                    if (Math.abs(accumulatedDelta) > 26 && now - lastStepTime > 340) {
                        lastStepTime = now;
                        accumulatedDelta = 0;
                        accumulatedExitDelta.current = 0;

                        const prevIdx = activeIndexRef.current - 1;
                        setDirection(-1);
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
                    if (now - lastStepTime > 340) {
                        lastStepTime = now;
                        const nextIdx = activeIndexRef.current + 1;
                        setDirection(1);
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
                    if (now - lastStepTime > 340) {
                        lastStepTime = now;
                        const prevIdx = activeIndexRef.current - 1;
                        setDirection(-1);
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
            <div className="w-full max-w-6xl mx-auto">
                <DrinkCard
                    drink={drinks[0]}
                    onAddToCart={onAddToCart}
                    isHighlighted={true}
                />
            </div>
        );
    }

    const currentDrink = drinks[activeIndex];

    // Clean animation variants: previous card descends smoothly ("pindah ke bawah"),
    // and new card rises up into view ("naik ke atas")
    const cardVariants = {
        enter: (dir) => ({
            y: dir > 0 ? 80 : -80,
            opacity: 0,
            scale: 0.96,
            rotateX: dir > 0 ? -6 : 6,
        }),
        center: {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transition: {
                y: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 },
                rotateX: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 },
                scale: { duration: 0.28, ease: 'easeOut' },
                opacity: { duration: 0.22 },
            },
        },
        exit: (dir) => ({
            y: dir > 0 ? 80 : -80,
            opacity: 0,
            scale: 0.96,
            rotateX: dir > 0 ? 6 : -6,
            transition: {
                y: { duration: 0.2, ease: 'easeIn' },
                rotateX: { duration: 0.2, ease: 'easeIn' },
                scale: { duration: 0.2 },
                opacity: { duration: 0.16 },
            },
        }),
    };

    return (
        <section
            ref={sectionRef}
            className="w-full py-6 select-none relative"
            style={{ perspective: '1400px' }}
        >
            {/* Perspective Card Stage with Elastic Boundary Bounce */}
            <motion.div
                animate={
                    boundaryBounce === 'bottom'
                        ? { y: [0, 14, -6, 0] }
                        : boundaryBounce === 'top'
                        ? { y: [0, -14, 6, 0] }
                        : { y: 0 }
                }
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="relative w-full max-w-6xl mx-auto flex items-center justify-center"
            >
                {/* Subtle Deck Stack Layers underneath for physical depth */}
                <div className="absolute inset-x-6 sm:inset-x-10 -bottom-3 sm:-bottom-4 h-20 rounded-[32px] bg-[#121417]/[0.04] dark:bg-white/[0.04] border border-[#121417]/10 dark:border-white/10 -z-10 scale-[0.98] pointer-events-none transition-all" />
                <div className="absolute inset-x-12 sm:inset-x-16 -bottom-6 sm:-bottom-7 h-20 rounded-[32px] bg-[#121417]/[0.02] dark:bg-white/[0.02] border border-[#121417]/5 dark:border-white/5 -z-20 scale-[0.96] pointer-events-none transition-all" />

                {/* Animated Active Card Showcase */}
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={currentDrink.id}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full"
                    >
                        <DrinkCard
                            drink={currentDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={true}
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
