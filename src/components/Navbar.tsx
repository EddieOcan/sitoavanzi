"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar({ availableBrands = [] }: { availableBrands?: string[] }) {
    const pathname = usePathname();
    const [hoveredDropdown, setHoveredDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const mainLinks = [
        { name: "Home", href: "/" },
        { name: "KTM", href: "/ktm", color: "orange" },
        { name: "Husqvarna", href: "/husqvarna", color: "blue" },
        { name: "Voge", href: "/voge", color: "yellow" },
        { name: "Kymco", href: "/kymco", color: "green" },
    ];

    const otherBrands = [
        { name: "Beta", href: "/beta", color: "red" },
        { name: "Fantic", href: "/fantic", color: "fuchsia" },
        { name: "Honda", href: "/honda", color: "red" },
        { name: "Ducati", href: "/ducati", color: "red" },
        { name: "BMW", href: "/bmw", color: "blue" },
        { name: "Piaggio", href: "/piaggio", color: "blue" },
    ].filter(b => availableBrands.some(ab => ab.toLowerCase() === b.name.toLowerCase()));

    const allNewBrands = [...mainLinks.filter(l => l.href !== '/'), ...otherBrands];

    const getBrandColorClass = (color: string) => {
        const map: Record<string, string> = {
            orange: 'text-orange-500',
            blue: 'text-blue-500',
            yellow: 'text-yellow-500',
            green: 'text-green-500',
            red: 'text-red-600',
            fuchsia: 'text-fuchsia-500',
        };
        return map[color] || 'text-white';
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-6 right-6 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-4 shadow-2xl hover:bg-white/10 transition-colors"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="h-full overflow-y-auto pt-28 pb-12 px-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Home Link */}
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center gap-3 mb-12 pb-8 border-b border-white/5"
                            >
                                <div className="w-1 h-8 bg-orange-500 rounded-full" />
                                <span className="text-3xl font-black uppercase text-white group-hover:text-orange-500 transition-colors tracking-tighter">
                                    Home
                                </span>
                            </Link>

                            {/* NUOVO Section */}
                            <div className="mb-16">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
                                        Moto Nuove
                                    </h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 to-transparent" />
                                </div>

                                <div className="space-y-3">
                                    {allNewBrands.map((brand, index) => {
                                        const getHoverClasses = (color: string) => {
                                            const map: Record<string, { dot: string; text: string }> = {
                                                orange: { dot: 'group-hover:bg-orange-500', text: 'group-hover:text-orange-500' },
                                                blue: { dot: 'group-hover:bg-blue-500', text: 'group-hover:text-blue-500' },
                                                yellow: { dot: 'group-hover:bg-yellow-500', text: 'group-hover:text-yellow-500' },
                                                green: { dot: 'group-hover:bg-green-500', text: 'group-hover:text-green-500' },
                                                red: { dot: 'group-hover:bg-red-600', text: 'group-hover:text-red-600' },
                                                fuchsia: { dot: 'group-hover:bg-fuchsia-500', text: 'group-hover:text-fuchsia-500' },
                                            };
                                            return map[color] || map.orange;
                                        };

                                        const hoverClasses = getHoverClasses(brand.color || 'orange');

                                        return (
                                            <motion.div
                                                key={brand.href}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + index * 0.05 }}
                                            >
                                                <Link
                                                    href={brand.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="group flex items-center justify-between py-4 px-6 bg-neutral-900/30 border border-neutral-800/50 rounded-xl hover:bg-neutral-900/60 hover:border-white/10 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-neutral-700 ${hoverClasses.dot} transition-colors`} />
                                                        <span className={`text-lg font-black uppercase tracking-tight text-neutral-400 ${hoverClasses.text} transition-colors`}>
                                                            {brand.name}
                                                        </span>
                                                    </div>
                                                    <div className="text-neutral-700 group-hover:text-neutral-500 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* USATO Section */}
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
                                        Moto Usate
                                    </h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 to-transparent" />
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link
                                        href="/usato"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group relative flex flex-col gap-3 py-6 px-6 bg-teal-500/5 border border-teal-500/20 rounded-2xl hover:bg-teal-500/10 hover:border-teal-500/40 transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-teal-400" />
                                                <span className="text-xl font-black uppercase tracking-tight text-teal-400 group-hover:text-teal-300 transition-colors">
                                                    Usato
                                                </span>
                                            </div>
                                            <div className="text-teal-600 group-hover:text-teal-400 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="relative text-xs text-neutral-500 font-medium">
                                            Scopri le nostre occasioni certificate
                                        </p>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Navbar */}
            <div className="hidden lg:flex fixed top-6 left-0 right-0 z-50 justify-center px-4 pointer-events-none">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 shadow-2xl shadow-orange-500/10 flex items-center gap-1 pointer-events-auto"
                >
                    {/* Main Links */}
                    {mainLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const colorClass = link.color === 'orange' ? 'hover:text-orange-500' :
                            link.color === 'blue' ? 'hover:text-blue-500' :
                                link.color === 'yellow' ? 'hover:text-yellow-500' :
                                    link.color === 'green' ? 'hover:text-green-500' : 'hover:text-white';

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative group px-5 py-3 rounded-full transition-colors"
                            >
                                <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-white" : "text-neutral-400"} ${colorClass}`}>
                                    {link.name}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-bg"
                                        className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {/* Dropdown "Altro" */}
                    {otherBrands.length > 0 && (
                        <div
                            className="relative px-5 py-3 cursor-pointer group flex items-center"
                            onMouseEnter={() => setHoveredDropdown(true)}
                            onMouseLeave={() => setHoveredDropdown(false)}
                        >
                            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors translate-y-[2px]">
                                Altro <ChevronDown className="w-3 h-3" />
                            </div>

                            <AnimatePresence>
                                {hoveredDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 w-40 bg-black border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                    >
                                        {otherBrands.map((brand) => {
                                            const hoverColorClass = brand.color === 'red' ? 'hover:text-red-600' :
                                                brand.color === 'fuchsia' ? 'hover:text-fuchsia-500' :
                                                    brand.color === 'blue' ? 'hover:text-blue-500' : 'hover:text-white';

                                            return (
                                                <Link
                                                    key={brand.href}
                                                    href={brand.href}
                                                    className={`block px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 ${hoverColorClass} hover:bg-white/5 transition-colors text-center`}
                                                >
                                                    {brand.name}
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-px h-6 bg-white/10 mx-2" />

                    {/* Usato Link - Distinct Style */}
                    <Link
                        href="/usato"
                        className={`relative px-6 py-3 rounded-full transition-all duration-300 group overflow-hidden ${pathname === '/usato' ? 'bg-teal-500/20 text-teal-400' : 'hover:bg-teal-500/10 text-neutral-400 hover:text-teal-400'}`}
                    >
                        <span className="relative z-10 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            Usato
                        </span>
                        {pathname === '/usato' && (
                            <motion.div
                                layoutId="navbar-bg-usato"
                                className="absolute inset-0 border border-teal-500/30 rounded-full"
                            />
                        )}
                    </Link>
                </motion.nav>
            </div>
        </>
    );
}
