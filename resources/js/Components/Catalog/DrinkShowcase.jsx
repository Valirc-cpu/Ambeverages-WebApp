import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrinkCard from './DrinkCard';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Layers,
    SlidersHorizontal,
    Sparkles
} from 'lucide-react';

export default function DrinkShowcase({ drinks = [], onAddToCart }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'list'
    const [progressKey, setProgressKey] = useState(0);

    const hasMultiple = drinks.length > 1;

    // Reset current index when drinks change
    useEffect(() => {
        setCurrentIndex(0);
        setProgressKey((prev) => prev + 1);
    }, [drinks.length]);

    // Auto-scroll animation when drinks > 1
    useEffect(() => {
        if (!hasMultiple || !isAutoPlay || isHovered || viewMode !== 'carousel') {
            return;
        }

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % drinks.length);
            setProgressKey((prev) => prev + 1);
        }, 4500);

        return () => clearInterval(interval);
    }, [hasMultiple, isAutoPlay, isHovered, drinks.length, viewMode]);

    const handleNext = () => {
        if (!hasMultiple) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % drinks.length);
        setProgressKey((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (!hasMultiple) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + drinks.length) % drinks.length);
        setProgressKey((prev) => prev + 1);
    };

    const handleSelectIndex = (idx) => {
        if (idx === currentIndex) return;
        setDirection(idx > currentIndex ? 1 : -1);
        setCurrentIndex(idx);
        setProgressKey((prev) => prev + 1);
    };

    // Slide animation variants
    const slideVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 120 : -120,
            opacity: 0,
            scale: 0.96,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: 'spring', stiffness: 320, damping: 28 },
                opacity: { duration: 0.28 },
                scale: { type: 'spring', stiffness: 350, damping: 25 },
            },
        },
        exit: (dir) => ({
            x: dir < 0 ? 120 : -120,
            opacity: 0,
            scale: 0.96,
            transition: {
                x: { type: 'spring', stiffness: 320, damping: 28 },
                opacity: { duration: 0.2 },
            },
        }),
    };

    if (drinks.length === 0) return null;

    const currentDrink = drinks[currentIndex] || drinks[0];

    return (
        <div className="space-y-6">
            {/* Top Bar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FA4B00]" />
                        <span>Katalog Menu Format Lebar</span>
                    </span>

                    {hasMultiple && viewMode === 'carousel' && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECEFF2] dark:bg-[#1E222A] text-xs font-bold text-[#121417] dark:text-white">
                            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
                            <span className="text-[#9CA3AF]">/</span>
                            <span className="text-[#9CA3AF]">{String(drinks.length).padStart(2, '0')}</span>
                        </div>
                    )}
                </div>

                {/* Switcher & Play/Pause */}
                <div className="flex items-center gap-2.5">
                    {hasMultiple && viewMode === 'carousel' && (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsAutoPlay(!isAutoPlay)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F2F4F7] dark:bg-[#1E222A] hover:bg-[#E5E8EC] dark:hover:bg-[#282C34] text-[#121417] dark:text-white transition-colors border border-[#DCE0E5] dark:border-[#2C313B]"
                                title={isAutoPlay ? 'Jeda Animasi Auto-Scroll' : 'Mulai Animasi Auto-Scroll'}
                            >
                                {isAutoPlay ? (
                                    <>
                                        <Pause className="w-3.5 h-3.5 text-[#FA4B00]" />
                                        <span className="hidden sm:inline">Jeda Auto-Scroll</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 text-[#1EBE5D]" />
                                        <span className="hidden sm:inline">Auto-Scroll</span>
                                    </>
                                )}
                            </button>

                            {/* Left & Right Arrow Buttons */}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="p-2 rounded-full bg-white dark:bg-[#181A20] hover:bg-gray-100 dark:hover:bg-[#22262E] text-[#121417] dark:text-white border border-[#DCE0E5] dark:border-[#2C313B] shadow-xs active:scale-95 transition-all"
                                    aria-label="Minuman Sebelumnya"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="p-2 rounded-full bg-white dark:bg-[#181A20] hover:bg-gray-100 dark:hover:bg-[#22262E] text-[#121417] dark:text-white border border-[#DCE0E5] dark:border-[#2C313B] shadow-xs active:scale-95 transition-all"
                                    aria-label="Minuman Selanjutnya"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}

                    {/* View Mode Toggle: Carousel vs List */}
                    {hasMultiple && (
                        <div className="flex items-center p-1 bg-[#ECEFF2] dark:bg-[#181A20] rounded-full border border-[#DCE0E5] dark:border-[#282C34]">
                            <button
                                type="button"
                                onClick={() => setViewMode('carousel')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                                    viewMode === 'carousel'
                                        ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-xs'
                                        : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417]'
                                }`}
                                title="Mode Sorotan Utama dengan Animasi Scrolling"
                            >
                                Sorotan
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-xs'
                                        : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417]'
                                }`}
                                title="Mode Tampilkan Semua Kartu Lebar"
                            >
                                Semua Menu
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mode 1: Scrolling Showcase Carousel */}
            {viewMode === 'carousel' ? (
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Animated Progress Bar when Auto-Play is Active */}
                    {hasMultiple && isAutoPlay && (
                        <div className="w-full h-1 bg-[#E5E8EC] dark:bg-[#282C34] rounded-full overflow-hidden mb-3">
                            <motion.div
                                key={progressKey}
                                initial={{ width: '0%' }}
                                animate={{ width: isHovered ? '0%' : '100%' }}
                                transition={{ duration: 4.5, ease: 'linear' }}
                                className="h-full bg-[#FA4B00]"
                            />
                        </div>
                    )}

                    {/* Main Stage: Highlighted Wide Card */}
                    <div className="relative min-h-[320px] flex items-center justify-center">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={currentDrink.id}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full max-w-4xl mx-auto"
                            >
                                <DrinkCard
                                    drink={currentDrink}
                                    onAddToCart={onAddToCart}
                                    isHighlighted={true}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Thumbnail Strip (Quick Navigation between cards) */}
                    {hasMultiple && (
                        <div className="pt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
                            {drinks.map((drink, idx) => {
                                const isSelected = idx === currentIndex;
                                return (
                                    <button
                                        key={drink.id}
                                        type="button"
                                        onClick={() => handleSelectIndex(idx)}
                                        className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                                            isSelected
                                                ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-md scale-105'
                                                : 'bg-white dark:bg-[#181A20] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white border border-[#E5E8EC] dark:border-[#282C34]'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#B9F24B]' : 'bg-[#CBD2D9] dark:bg-[#4B5563]'}`} />
                                        <span className="truncate max-w-[120px] sm:max-w-[160px]">{drink.name}</span>
                                        <span className="text-[10px] opacity-75">{drink.formatted_price}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                /* Mode 2: Stacked Wide Cards (All Cards Visible) */
                <div className="space-y-6 max-w-4xl mx-auto">
                    {drinks.map((drink, idx) => (
                        <DrinkCard
                            key={drink.id}
                            drink={drink}
                            onAddToCart={onAddToCart}
                            isHighlighted={idx === currentIndex}
                            onSelect={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
