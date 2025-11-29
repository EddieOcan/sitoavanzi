"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench, ShieldCheck, Bike, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <main className="bg-neutral-950 min-h-screen">

            {/* HERO SECTION */}
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Background Image with Parallax-like feel */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-motorcycle.png"
                        alt="Hero Motorcycle"
                        fill
                        className="object-cover object-center brightness-50"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/80" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-orange-500 font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-4">
                            Dal 1980 • Passione Due Ruote
                        </h2>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                            Avanzi<span className="text-orange-500">.</span>Moto
                        </h1>
                        <p className="text-neutral-300 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
                            L'eccellenza nel mondo delle due ruote. Vendita, assistenza e customizzazione per veri appassionati.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/catalogo" className="group relative px-8 py-4 bg-orange-500 text-black font-black uppercase tracking-widest overflow-hidden">
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Esplora Catalogo</span>
                                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </Link>
                            <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 backdrop-blur-sm">
                                I Nostri Servizi
                            </button>
                        </div>
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

            {/* SERVICES SECTION */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 border-b border-neutral-800 pb-8">
                        <div>
                            <h2 className="text-orange-500 font-bold tracking-[0.2em] uppercase text-sm mb-2">Cosa Offriamo</h2>
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
                                Servizi <span className="text-neutral-800">Premium</span>
                            </h3>
                        </div>
                        <p className="text-neutral-400 max-w-md text-right md:text-left">
                            Offriamo un servizio completo a 360° per la tua moto, dalla vendita all'assistenza post-vendita specializzata.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>

                </div>
            </section>

        </main>
    );
}

const services = [
    {
        title: "Vendita Nuovo",
        description: "Concessionaria ufficiale dei migliori marchi. Scopri le ultime novità del mercato.",
        icon: Bike,
    },
    {
        title: "Usato Garantito",
        description: "Selezione accurata di moto usate, controllate e garantite dalla nostra officina.",
        icon: ShieldCheck,
    },
    {
        title: "Officina",
        description: "Assistenza specializzata, tagliandi, riparazioni e preparazioni pista.",
        icon: Wrench,
    },
    {
        title: "Custom",
        description: "Personalizzazioni estetiche e meccaniche per rendere unica la tua moto.",
        icon: Trophy,
    },
];

function ServiceCard({ service, index }: { service: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-neutral-900/50 border border-neutral-800 p-8 hover:border-orange-500 transition-colors duration-500 overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <service.icon className="w-24 h-24 text-orange-500 rotate-12 transform group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-500">
                    <service.icon className="w-6 h-6 text-white" />
                </div>

                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                    {service.title}
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {service.description}
                </p>

                <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                    Scopri di più <ArrowRight className="w-3 h-3" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.div>
    );
}
