export type SanityImage = {
    asset: {
        _ref: string;
        _type: "reference";
    };
    _type: "image";
    _key?: string;
};

export type Motorcycle = {
    _id: string;
    title: string;
    slug: string;
    images?: SanityImage[];  // Optimized: Array of image objects
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
