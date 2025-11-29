import { getMotorcycles } from "@/lib/sanity.fetch";
import CatalogGrid from "@/components/CatalogGrid";

export default async function CatalogPage() {
    const motorcycles = await getMotorcycles();

    return (
        <div className="min-h-screen bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Modern Header */}
                <div className="relative mb-12 pt-8">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-800 pb-8">
                        <div className="relative">
                            {/* Small Overline */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                <span className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em]">
                                    Collezione 2024
                                </span>
                            </div>

                            {/* Main Title - Solid White */}
                            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                                Catalogo
                            </h1>

                            {/* Subtitle */}
                            <p className="text-neutral-400 text-lg max-w-xl mt-4 font-light border-l-2 border-orange-500/50 pl-4">
                                Esplora la nostra selezione esclusiva. <br />
                                <span className="text-white font-medium">Prestazioni pure, stile inconfondibile.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Grid with Filters */}
                <CatalogGrid motorcycles={motorcycles} />
            </div>
        </div>
    );
}
