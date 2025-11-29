import { getMotorcycles } from "@/lib/sanity.fetch";
import CatalogGrid from "@/components/CatalogGrid";

export default async function UsedPage() {
    const motorcycles = await getMotorcycles();

    return (
        <div className="min-h-screen bg-neutral-950 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Modern Header */}
                <div className="relative mb-12 pt-8">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl -z-10" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-800 pb-8">
                        <div className="relative">
                            {/* Small Overline */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-teal-400 rounded-full" />
                                <span className="text-teal-400 text-xs font-bold uppercase tracking-[0.2em]">
                                    Occasioni Garantite
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                                Usato
                            </h1>

                            {/* Subtitle */}
                            <p className="text-neutral-400 text-lg max-w-xl mt-4 font-light border-l-2 border-teal-400/50 pl-4">
                                La nostra selezione di moto usate certificate. <br />
                                <span className="text-white font-medium">Qualità controllata, prezzo imbattibile.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Grid with Filters */}
                <CatalogGrid
                    motorcycles={motorcycles}
                    isUsed={true} // Show ONLY used bikes
                    themeColor="teal"
                />
            </div>
        </div>
    );
}
