"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrapedBike {
    title: string;
    price: number;
    kilometers: number;
    year: number;
    imageUrl: string;
    images?: string[]; // New field for gallery
    externalUrl: string;
    imported: boolean;
}

interface ImportResult {
    title: string;
    status: 'success' | 'error';
    error?: string;
}

export default function ScraperPage() {
    const [bikes, setBikes] = useState<ScrapedBike[]>([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [selectedBikes, setSelectedBikes] = useState<Set<number>>(new Set());
    const [results, setResults] = useState<ImportResult[]>([]);

    const fetchBikes = async () => {
        setLoading(true);
        setBikes([]);
        setResults([]);
        try {
            const res = await fetch('/api/scrape');
            if (res.ok) {
                const data = await res.json();
                setBikes(data.bikes || []);
                // Select all by default
                setSelectedBikes(new Set(data.bikes.map((_: any, i: number) => i)));
            } else {
                alert('Errore nel caricamento: ' + res.statusText);
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (index: number) => {
        const newSelected = new Set(selectedBikes);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedBikes(newSelected);
    };

    const importSelected = async () => {
        if (selectedBikes.size === 0) return;
        setImporting(true);
        const bikesToImport = bikes.filter((_, i) => selectedBikes.has(i));

        try {
            const res = await fetch('/api/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bikes: bikesToImport })
            });
            const data = await res.json();
            setResults(data.results || []);

            // Mark as imported in local state if successful
            if (data.results) {
                // Optimization: update visual state
            }

        } catch (error) {
            alert('Errore durante l\'importazione');
            console.error(error);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Scraper Moto.it</h1>
                        <p className="text-neutral-400">Importa annunci usati da dealer.moto.it/avanzimoto</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchBikes}
                            disabled={loading || importing}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full uppercase tracking-widest transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Caricamento...' : 'Avvia Scraper'}
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* List Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold uppercase">Trovate {bikes.length} Moto</h2>
                            {bikes.length > 0 && (
                                <div className="text-sm text-neutral-400">
                                    {selectedBikes.size} selezionate
                                </div>
                            )}
                        </div>

                        {loading && (
                            <div className="h-64 flex items-center justify-center border border-white/10 rounded-2xl bg-white/5 animate-pulse">
                                <span className="text-neutral-500 font-bold uppercase tracking-widest">Scraping in corso...</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bikes.map((bike, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => toggleSelection(index)}
                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${selectedBikes.has(index)
                                        ? 'bg-neutral-900 border-orange-500 ring-1 ring-orange-500'
                                        : 'bg-neutral-900/50 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="relative aspect-[4/3] bg-neutral-800 rounded-lg mb-4 overflow-hidden">
                                        {bike.images && bike.images.length > 0 ? (
                                            <>
                                                <img
                                                    src={bike.images[0]}
                                                    alt={bike.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {bike.images.length > 1 && (
                                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                                                        +{bike.images.length - 1} FOTO
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold">
                                            {bike.year}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-sm truncate" title={bike.title}>{bike.title}</h3>
                                    <div className="flex justify-between mt-2 text-xs text-neutral-400 uppercase font-medium">
                                        <span>{bike.kilometers.toLocaleString()} km</span>
                                        <span className="text-white">€ {bike.price.toLocaleString()}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Actions Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-6">
                            <h2 className="text-xl font-bold uppercase">Azioni</h2>

                            <button
                                onClick={importSelected}
                                disabled={selectedBikes.size === 0 || importing}
                                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {importing ? 'Import in corso...' : `Importa (${selectedBikes.size})`}
                            </button>

                            {/* Import Results Log */}
                            {results.length > 0 && (
                                <div className="space-y-2 mt-8 pt-8 border-t border-white/10">
                                    <h3 className="font-bold text-sm text-neutral-400 uppercase">Log Importazione</h3>
                                    <div className="max-h-[300px] overflow-y-auto space-y-2 text-xs font-mono">
                                        {results.map((res, i) => (
                                            <div key={i} className={`flex items-start gap-2 ${res.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                <span>{res.status === 'success' ? '✓' : '✗'}</span>
                                                <span className="truncate">{res.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500">
                                <strong>Nota:</strong> Le immagini vengono scaricate dal sito originale. I nomi delle moto vengono usati per generare gli slug.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
