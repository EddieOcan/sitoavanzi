"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import MotorcycleCard from "./MotorcycleCard";
import { motion, AnimatePresence } from "framer-motion";
import RangeSlider from "./ui/RangeSlider";
import { formatPrice } from "@/lib/utils";

type Motorcycle = {
    _id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    price: number;
    brand: string;
    year: number;
    displacement?: number;
    description?: string;
    isUsed?: boolean;
    kilometers?: number;
    catchphrase?: string;
    summary?: string;
};

export default function CatalogGrid({
    motorcycles,
    brand,
    isUsed = false,
    themeColor = "orange"
}: {
    motorcycles: Motorcycle[],
    brand?: string,
    isUsed?: boolean,
    themeColor?: string
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Calculate Bounds from Data
    const bounds = useMemo(() => {
        if (motorcycles.length === 0) return {
            year: { min: 2000, max: new Date().getFullYear() },
            price: { min: 0, max: 50000 },
            displacement: { min: 50, max: 2000 }
        };

        const years = motorcycles.map(m => m.year);
        const prices = motorcycles.map(m => m.price);
        const displacements = motorcycles.map(m => m.displacement || 0).filter(d => d > 0);

        return {
            year: {
                min: Math.min(...years),
                max: Math.max(...years) === Math.min(...years) ? Math.min(...years) + 1 : Math.max(...years)
            },
            price: {
                min: Math.min(...prices),
                max: Math.max(...prices) === Math.min(...prices) ? Math.min(...prices) + 1000 : Math.max(...prices)
            },
            displacement: {
                min: displacements.length ? Math.min(...displacements) : 50,
                max: (displacements.length ? Math.max(...displacements) : 1200) === (displacements.length ? Math.min(...displacements) : 50) ? (displacements.length ? Math.min(...displacements) : 50) + 100 : (displacements.length ? Math.max(...displacements) : 1200)
            }
        };
    }, [motorcycles]);

    // Filters State
    const [filters, setFilters] = useState({
        yearRange: [bounds.year.min, bounds.year.max] as [number, number],
        priceRange: [bounds.price.min, bounds.price.max] as [number, number],
        displacementRange: [bounds.displacement.min, bounds.displacement.max] as [number, number],
        selectedBrands: [] as string[],
    });

    // Update filters when bounds change (e.g. initial load)
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            yearRange: [bounds.year.min, bounds.year.max],
            priceRange: [bounds.price.min, bounds.price.max],
            displacementRange: [bounds.displacement.min, bounds.displacement.max],
        }));
    }, [bounds]);

    // Filter Logic
    const filteredMotorcycles = useMemo(() => {
        return motorcycles.filter(moto => {
            // 1. Page-Level Filters (Brand Page or Used Page)
            if (brand && moto.brand.toLowerCase() !== brand.toLowerCase()) return false;

            // If we are on a specific brand page (and not the used page), show only NEW bikes
            if (brand && !isUsed && moto.isUsed) return false;

            // If we are on the used page, show ONLY used bikes
            if (isUsed && !moto.isUsed) return false;

            // 2. User Filters
            // Search
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                moto.title.toLowerCase().includes(searchLower) ||
                moto.brand.toLowerCase().includes(searchLower) ||
                moto.description?.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // Brand Filter (Sidebar) - Only if not on a brand page
            if (!brand && filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(moto.brand)) return false;

            // Year
            if (moto.year < filters.yearRange[0] || moto.year > filters.yearRange[1]) return false;

            // Price
            if (moto.price < filters.priceRange[0] || moto.price > filters.priceRange[1]) return false;

            // Displacement
            const disp = moto.displacement || 0;
            if (disp > 0 && (disp < filters.displacementRange[0] || disp > filters.displacementRange[1])) return false;

            return true;
        });
    }, [motorcycles, searchQuery, filters, brand, isUsed]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleBrand = (brandName: string) => {
        setFilters(prev => {
            const current = prev.selectedBrands;
            if (current.includes(brandName)) {
                return { ...prev, selectedBrands: current.filter(b => b !== brandName) };
            } else {
                return { ...prev, selectedBrands: [...current, brandName] };
            }
        });
    };

    const clearFilters = () => {
        setFilters({
            yearRange: [bounds.year.min, bounds.year.max],
            priceRange: [bounds.price.min, bounds.price.max],
            displacementRange: [bounds.displacement.min, bounds.displacement.max],
            selectedBrands: [],
        });
        setSearchQuery("");
    };

    // Dynamic Styles based on Theme Color
    const getThemeColorClass = (type: 'text' | 'bg' | 'border' | 'hover-bg' | 'hover-text') => {
        const colorMap: Record<string, string> = {
            orange: 'orange-500',
            blue: 'blue-500',
            yellow: 'yellow-500',
            green: 'green-500',
            red: 'red-600',
            fuchsia: 'fuchsia-500',
            teal: 'teal-400',
        };
        const color = colorMap[themeColor] || 'orange-500';

        switch (type) {
            case 'text': return `text-${color}`;
            case 'bg': return `bg-${color}`;
            case 'border': return `border-${color}`;
            case 'hover-bg': return `hover:bg-${color}`;
            case 'hover-text': return `hover:text-${color}`;
            default: return '';
        }
    };

    const availableBrands = useMemo(() => {
        const brands = new Set(motorcycles.map(m => m.brand));
        return Array.from(brands).sort();
    }, [motorcycles]);

    // Scroll spotlight tracking for mobile
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            // Only on mobile
            if (window.innerWidth >= 768) {
                setActiveIndex(null);
                return;
            }

            const viewportCenter = window.innerHeight / 2;
            let closestIndex = null;
            let closestDistance = Infinity;

            cardRefs.current.forEach((card, index) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [filteredMotorcycles]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
            {/* Sidebar Filters - Desktop Sticky / Mobile Collapsible */}
            <aside className="w-full lg:w-[320px] lg:sticky lg:top-24 flex-shrink-0">

                {/* Mobile Toggle Button - Redesigned */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`lg:hidden w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border transition-all duration-300 group ${showFilters
                            ? `border-${themeColor}-500/50 mb-6`
                            : `border-white/10 mb-4 hover:border-white/20`
                        }`}
                >
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${themeColor}-500 to-transparent opacity-${showFilters ? '100' : '0'} transition-opacity duration-300`} />

                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl bg-neutral-800/50 border border-white/5 transition-all duration-300 ${showFilters ? getThemeColorClass('bg') + ' border-transparent' : 'group-hover:border-white/10'}`}>
                                <Search className={`w-5 h-5 transition-colors duration-300 ${showFilters ? 'text-black' : getThemeColorClass('text')}`} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white tracking-tight">
                                    {showFilters ? "Nascondi Filtri" : "Cerca la tua moto"}
                                </span>
                                <span className="text-xs text-neutral-500 font-medium">
                                    {showFilters ? "Chiudi ricerca" : "Apri ricerca e filtri"}
                                </span>
                            </div>
                        </div>
                        <SlidersHorizontal className={`w-5 h-5 ${getThemeColorClass('text')} transition-transform duration-300 ${showFilters ? 'rotate-90' : ''}`} />
                    </div>
                </button>

                {/* Filters Container */}
                <AnimatePresence>
                    {(showFilters || window.innerWidth >= 1024) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >

                            {/* Search Bar - Completely Redesigned */}
                            <div className="relative group">
                                {/* Gradient border container */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-neutral-800 via-white/10 to-neutral-800 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                                <div className="relative flex items-center bg-gradient-to-br from-neutral-900 to-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 group-focus-within:border-transparent transition-all duration-300">
                                    {/* Icon Container */}
                                    <div className={`flex items-center justify-center w-14 h-14 transition-all duration-300 ${searchQuery ? getThemeColorClass('text') : 'text-neutral-500 group-focus-within:text-white'}`}>
                                        <Search className="w-5 h-5" />
                                    </div>

                                    {/* Input */}
                                    <input
                                        type="text"
                                        placeholder="Cerca moto..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-white py-4 pr-4 focus:outline-none placeholder:text-neutral-600 font-medium tracking-tight"
                                    />

                                    {/* Clear Button */}
                                    {searchQuery && (
                                        <motion.button
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            onClick={() => setSearchQuery("")}
                                            className={`mr-3 p-2 rounded-lg bg-neutral-800/50 ${getThemeColorClass('hover-bg')} hover:text-black transition-all duration-300 group/btn`}
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Main Filter Card - Glassmorphism Style */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">

                                {/* Subtle gradient overlay */}
                                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-${themeColor}-500/5 to-transparent pointer-events-none`} />

                                <div className="relative p-7 space-y-8">

                                    {/* Header with Reset Button */}
                                    <div className="flex justify-between items-center pb-5 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getThemeColorClass('bg')}/10 border border-${themeColor}-500/20`}>
                                                <SlidersHorizontal className={`w-4 h-4 ${getThemeColorClass('text')}`} />
                                            </div>
                                            <h3 className="text-base font-black text-white uppercase tracking-wide">
                                                Filtri
                                            </h3>
                                        </div>
                                        {(
                                            filters.yearRange[0] !== bounds.year.min || filters.yearRange[1] !== bounds.year.max ||
                                            filters.priceRange[0] !== bounds.price.min || filters.priceRange[1] !== bounds.price.max ||
                                            filters.displacementRange[0] !== bounds.displacement.min || filters.displacementRange[1] !== bounds.displacement.max ||
                                            filters.selectedBrands.length > 0
                                        ) && (
                                                <button
                                                    onClick={clearFilters}
                                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 ${getThemeColorClass('hover-bg')} hover:text-black hover:border-transparent uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5`}
                                                >
                                                    <X className="w-3 h-3" /> Reset
                                                </button>
                                            )}
                                    </div>

                                    {/* Brand Filter (Only if not on brand page) */}
                                    {!brand && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">Marchio</label>
                                            <div className="grid gap-2.5">
                                                {availableBrands.map(b => (
                                                    <label
                                                        key={b}
                                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${filters.selectedBrands.includes(b)
                                                                ? `bg-${themeColor}-500/10 border border-${themeColor}-500/30`
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${filters.selectedBrands.includes(b)
                                                                ? getThemeColorClass('bg') + ' ' + getThemeColorClass('border') + ' shadow-lg'
                                                                : 'border-neutral-700'
                                                            }`}>
                                                            {filters.selectedBrands.includes(b) && (
                                                                <motion.svg
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="w-3 h-3 text-black"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={3}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </motion.svg>
                                                            )}
                                                        </div>
                                                        <span className={`text-sm font-semibold transition-colors ${filters.selectedBrands.includes(b) ? 'text-white' : 'text-neutral-400'
                                                            }`}>
                                                            {b}
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={filters.selectedBrands.includes(b)}
                                                            onChange={() => toggleBrand(b)}
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sliders Container */}
                                    <div className="space-y-7">

                                        {/* Year Slider */}
                                        <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">Anno</label>
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-900 border ${getThemeColorClass('border')}/20`}>
                                                    <span className={`text-xs font-bold ${getThemeColorClass('text')}`}>{filters.yearRange[0]}</span>
                                                    <span className="text-neutral-600 font-bold">→</span>
                                                    <span className={`text-xs font-bold ${getThemeColorClass('text')}`}>{filters.yearRange[1]}</span>
                                                </div>
                                            </div>
                                            <div className="px-2 pt-2">
                                                <RangeSlider
                                                    min={bounds.year.min}
                                                    max={bounds.year.max}
                                                    value={filters.yearRange}
                                                    onChange={(val) => handleFilterChange('yearRange', val)}
                                                    color={themeColor}
                                                />
                                            </div>
                                        </div>

                                        {/* Price Slider */}
                                        <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">Prezzo</label>
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-900 border ${getThemeColorClass('border')}/20`}>
                                                    <span className={`text-xs font-bold ${getThemeColorClass('text')}`}>{formatPrice(filters.priceRange[0])}</span>
                                                    <span className="text-neutral-600 font-bold">→</span>
                                                    <span className={`text-xs font-bold ${getThemeColorClass('text')}`}>{formatPrice(filters.priceRange[1])}</span>
                                                </div>
                                            </div>
                                            <div className="px-2 pt-2">
                                                <RangeSlider
                                                    min={bounds.price.min}
                                                    max={bounds.price.max}
                                                    step={100}
                                                    value={filters.priceRange}
                                                    onChange={(val) => handleFilterChange('priceRange', val)}
                                                    color={themeColor}
                                                />
                                            </div>
                                        </div>

                                        {/* Displacement Slider */}
                                        <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">Cilindrata</label>
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-900 border ${getThemeColorClass('border')}/20`}>
                                                    <span className={`text-xs font-bold ${getThemeColorClass('text')}`}>{filters.displacementRange[0]}cc</span>
                                                    <span className="text-neutral-600 font-bold">→</span>
                                                    <span className={`text-xs font-bold ${getThemeColorClass('text')}`}>{filters.displacementRange[1]}cc</span>
                                                </div>
                                            </div>
                                            <div className="px-2 pt-2">
                                                <RangeSlider
                                                    min={bounds.displacement.min}
                                                    max={bounds.displacement.max}
                                                    step={50}
                                                    value={filters.displacementRange}
                                                    onChange={(val) => handleFilterChange('displacementRange', val)}
                                                    color={themeColor}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results Count - Redesigned */}
                                    <div className={`mt-6 pt-6 border-t border-white/10 bg-gradient-to-br from-${themeColor}-500/10 to-transparent rounded-xl p-5 text-center`}>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${getThemeColorClass('bg')} animate-pulse`} />
                                            <span className="text-3xl font-black text-white tracking-tight">{filteredMotorcycles.length}</span>
                                            <span className="text-sm text-neutral-400 font-semibold uppercase tracking-wider">
                                                {filteredMotorcycles.length === 1 ? 'Risultato' : 'Risultati'}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </aside>

            {/* Main Content - Grid */}
            <main className="flex-1 w-full">
                {filteredMotorcycles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {filteredMotorcycles.map((moto, index) => (
                            <MotorcycleCard
                                key={moto._id}
                                moto={moto}
                                index={index}
                                themeColor={themeColor}
                                isActive={activeIndex === index}
                                cardRef={(el: HTMLDivElement | null) => cardRefs.current[index] = el}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-neutral-900/30 border border-neutral-800 border-dashed rounded-3xl">
                        <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
                            <Search className="w-8 h-8 text-neutral-600" />
                        </div>
                        <p className="text-xl text-white font-bold mb-2">Nessun risultato trovato</p>
                        <p className="text-sm text-neutral-500 mb-8">Prova a modificare i filtri di ricerca</p>
                        <button
                            onClick={clearFilters}
                            className={`px-8 py-3 ${getThemeColorClass('bg')} text-black font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg`}
                        >
                            Resetta Filtri
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
