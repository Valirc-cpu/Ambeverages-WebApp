import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrinkCard from './DrinkCard';

export default function DrinkParallaxDeck({ drinks = [], onAddToCart }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1: next (down), -1: prev (up)
    const [boundaryBounce, setBoundaryBounce] = useState(null); // 'top' | 'bottom' | null
    const [isDeckCompressing, setIsDeckCompressing] = useState(false);

    const sectionRef = useRef(null);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    // Safety buffer & momentum isolation refs
    const boundaryLockUntil = useRef(0);
    const accumulatedExitDelta = useRef(0);
    const bounceTimerRef = useRef(null);
    const compressTimerRef = useRef(null);

    const hasMultiple = drinks.length > 1;

    // Reset when category/search filter changes
    useEffect(() => {
        setActiveIndex(0);
        setDirection(1);
        boundaryLockUntil.current = Date.now() + 600;
        accumulatedExitDelta.current = 0;
    }, [drinks.length]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
            if (compressTimerRef.current) clearTimeout(compressTimerRef.current);
        };
    }, []);

    // Helper to trigger deck stack compression shockwave
    const triggerDeckCompression = () => {
        setIsDeckCompressing(true);
        if (compressTimerRef.current) clearTimeout(compressTimerRef.current);
        compressTimerRef.current = setTimeout(() => setIsDeckCompressing(false), 440);
    };

    // Helper to trigger rubber-band boundary bounce
    const triggerBoundaryEffect = (type) => {
        setBoundaryBounce(type);
        if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
        bounceTimerRef.current = setTimeout(() => setBoundaryBounce(null), 420);
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

                    if (Math.abs(accumulatedDelta) > 24 && now - lastStepTime > 360) {
                        lastStepTime = now;
                        accumulatedDelta = 0;
                        accumulatedExitDelta.current = 0;

                        const nextIdx = activeIndexRef.current + 1;
                        setDirection(1);
                        setActiveIndex(nextIdx);
                        triggerDeckCompression();

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

                    if (Math.abs(accumulatedDelta) > 24 && now - lastStepTime > 360) {
                        lastStepTime = now;
                        accumulatedDelta = 0;
                        accumulatedExitDelta.current = 0;

                        const prevIdx = activeIndexRef.current - 1;
                        setDirection(-1);
                        setActiveIndex(prevIdx);
                        triggerDeckCompression();

                        // If entering the first card, arm a 700ms momentum isolation lock
                        if (prevIdx === 0) {
                            boundaryLockUntil.current = now + 700;
                        }
                    }
                    return;
                }

                // Currently on the FIRST CARD:
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
                    if (now - lastStepTime > 360) {
                        lastStepTime = now;
                        const nextIdx = activeIndexRef.current + 1;
                        setDirection(1);
                        setActiveIndex(nextIdx);
                        triggerDeckCompression();
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
                    if (now - lastStepTime > 360) {
                        lastStepTime = now;
                        const prevIdx = activeIndexRef.current - 1;
                        setDirection(-1);
                        setActiveIndex(prevIdx);
                        triggerDeckCompression();
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
    const tiltSign = activeIndex % 2 === 0 ? 1 : -1;

    // Choreographed 3D Spatial Variants:
    // When advancing, outgoing card plunges into the deck with an organic arc trajectory,
    // while incoming card ascends from the depths with authentic spring settle!
    const cardVariants = {
        enter: (dir) => ({
            y: dir > 0 ? 120 : -120,
            z: -120,
            rotateX: dir > 0 ? -10 : 10,
            rotateZ: dir > 0 ? 1.8 * tiltSign : -1.8 * tiltSign,
            scale: 0.92,
            opacity: 0,
            filter: 'blur(3px)',
            zIndex: 20,
        }),
        center: {
            y: 0,
            z: 0,
            rotateX: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            zIndex: 20,
            transition: {
                y: { type: 'spring', stiffness: 220, damping: 22, mass: 0.75 },
                z: { type: 'spring', stiffness: 220, damping: 22, mass: 0.75 },
                rotateX: { type: 'spring', stiffness: 220, damping: 22, mass: 0.75 },
                rotateZ: { type: 'spring', stiffness: 240, damping: 24, mass: 0.75 },
                scale: { type: 'spring', stiffness: 200, damping: 20, mass: 0.75 },
                opacity: { duration: 0.28, ease: 'easeOut' },
                filter: { duration: 0.28, ease: 'easeOut' },
            },
        },
        exit: (dir) => ({
            y: dir > 0 ? 140 : -140,
            z: -160,
            rotateX: dir > 0 ? 12 : -12,
            rotateZ: dir > 0 ? -2.2 * tiltSign : 2.2 * tiltSign,
            scale: 0.89,
            opacity: 0,
            filter: 'blur(4px)',
            pointerEvents: 'none',
            zIndex: 10,
            transition: {
                y: { duration: 0.32, ease: [0.32, 0, 0.67, 0] },
                z: { duration: 0.32, ease: [0.32, 0, 0.67, 0] },
                rotateX: { duration: 0.32, ease: 'easeIn' },
                rotateZ: { duration: 0.32, ease: 'easeIn' },
                scale: { duration: 0.32 },
                opacity: { duration: 0.26, ease: 'easeIn' },
                filter: { duration: 0.3 },
            },
        }),
    };

    return (
        <section
            ref={sectionRef}
            className="w-full py-8 select-none relative"
            style={{ perspective: '1600px' }}
        >
            {/* Perspective Card Stage with Elastic Boundary Bounce */}
            <motion.div
                animate={
                    boundaryBounce === 'bottom'
                        ? { y: [0, 22, -9, 3, 0], rotateX: [0, 4, -1.5, 0] }
                        : boundaryBounce === 'top'
                        ? { y: [0, -22, 9, -3, 0], rotateX: [0, -4, 1.5, 0] }
                        : { y: 0, rotateX: 0 }
                }
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full max-w-6xl mx-auto flex items-center justify-center"
            >
                {/* Dynamic Reactive Deck Stack (Physical Depth Layers) */}
                <motion.div
                    animate={isDeckCompressing ? { scaleY: 0.93, y: [0, 7, -2, 0] } : { scaleY: 1, y: 0 }}
                    transition={{ duration: 0.38, ease: 'easeOut' }}
                    className="absolute inset-x-6 sm:inset-x-12 -bottom-3 sm:-bottom-4 h-24 rounded-[32px] bg-[#121417]/[0.04] dark:bg-white/[0.04] border border-[#121417]/10 dark:border-white/10 -z-10 scale-[0.98] pointer-events-none origin-top transition-transform"
                />
                <motion.div
                    animate={isDeckCompressing ? { scaleY: 0.88, y: [0, 13, -3, 0] } : { scaleY: 1, y: 0 }}
                    transition={{ duration: 0.44, ease: 'easeOut' }}
                    className="absolute inset-x-12 sm:inset-x-20 -bottom-6 sm:-bottom-8 h-24 rounded-[32px] bg-[#121417]/[0.02] dark:bg-white/[0.02] border border-[#121417]/5 dark:border-white/5 -z-20 scale-[0.95] pointer-events-none origin-top transition-transform"
                />

                {/* Animated Active Card Showcase */}
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                        key={currentDrink.id}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ transformStyle: 'preserve-3d' }}
                        className="w-full relative"
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
