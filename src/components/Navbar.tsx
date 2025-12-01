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
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="lg:hidden fixed inset-0 bg-black z-40 flex flex-col"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="flex-1 overflow-y-auto pt-24 pb-8 px-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Home */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="group flex items-center justify-between py-5 border-b border-neutral-900"
                                >
                                    <span className="text-lg font-black uppercase text-white tracking-tight">
                                        Home
                                    </span>
                                    <svg className="w-5 h-5 text-neutral-700 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.div>

                            {/* Brands */}
                            <div className="py-6">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="mb-4"
                                >
                                    <h2 className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-700 px-1">
                                        Nuovo
                                    </h2>
                                </motion.div>

                                {allNewBrands.map((brand, index) => {
                                    const getAccentColor = (color: string) => {
                                        const map: Record<string, string> = {
                                            orange: 'group-hover:text-orange-500',
                                            blue: 'group-hover:text-blue-500',
                                            yellow: 'group-hover:text-yellow-500',
                                            green: 'group-hover:text-green-500',
                                            red: 'group-hover:text-red-600',
                                            fuchsia: 'group-hover:text-fuchsia-500',
                                        };
                                        return map[color] || map.orange;
                                    };

                                    return (
                                        <motion.div
                                            key={brand.href}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 + index * 0.03 }}
                                        >
                                            <Link
                                                href={brand.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="group flex items-center justify-between py-5 border-b border-neutral-900"
                                            >
                                                <span className={`text-lg font-black uppercase text-neutral-500 tracking-tight transition-colors ${getAccentColor(brand.color || 'orange')}`}>
                                                    {brand.name}
                                                </span>
                                                <svg className={`w-5 h-5 text-neutral-800 transition-colors ${getAccentColor(brand.color || 'orange')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Usato */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="pt-6"
                            >
                                <div className="mb-4">
                                    <h2 className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-700 px-1">
                                        Usato
                                    </h2>
                                </div>

                                <Link
                                    href="/usato"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="group flex items-center justify-between py-5 border-b border-neutral-900"
                                >
                                    <span className="text-lg font-black uppercase text-neutral-500 tracking-tight group-hover:text-teal-400 transition-colors">
                                        Usato Garantito
                                    </span>
                                    <svg className="w-5 h-5 text-neutral-800 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.div>
                        </div>
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
