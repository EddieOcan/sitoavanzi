"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroProps {
    heroImageUrl?: string;
}

export default function Hero({ heroImageUrl }: HeroProps) {
    return (
        <section className="relative min-h-screen w-full flex items-center pt-32 pb-20 overflow-x-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImageUrl || "/hero-motorcycle.png"}
                    alt="Hero Motorcycle"
                    fill
                    className="object-cover object-center brightness-[0.65]"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />
            </div>

            {/* Hero Content - Centered */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <motion.div
                    className="max-w-4xl text-center"
                >


                    {/* Small Overline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center justify-center gap-2 mb-8"
                    >
                        <span className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em]">
                            Brescia, dal 1950
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none mb-8"
                    >
                        Avanzi Moto
                    </motion.h1>

                    {/* Main Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="text-neutral-200 text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        Concessionario ufficiale di moto <span className="text-orange-500 font-bold">KTM</span>, <span className="text-orange-500 font-bold">HUSQVARNA</span>, <span className="text-orange-500 font-bold">KYMCO</span> e <span className="text-orange-500 font-bold">VOGE</span> a Bagnolo Mella, in provincia di Brescia.
                    </motion.p>

                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Scorri</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent" />
            </motion.div>
        </section>
    );
}
