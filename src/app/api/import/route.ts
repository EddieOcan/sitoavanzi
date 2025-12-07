import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Initialize Sanity Client with Write Token
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN, // Must be a write token
    useCdn: false,
});

async function uploadImageToSanity(imageUrl: string) {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);
    const blob = await res.blob();
    const asset = await client.assets.upload('image', blob, {
        filename: imageUrl.split('/').pop() || 'image.jpg',
    });
    return asset._id;
}

export async function POST(req: NextRequest) {
    try {
        const { bikes } = await req.json();

        if (!bikes || !Array.isArray(bikes)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }
        const results = [];

        if (!process.env.SANITY_API_TOKEN) {
            return NextResponse.json({
                error: 'Configuration Error: SANITY_API_TOKEN is missing in .env.local. Please add a "Editor" token from sanity.io/manage.'
            }, { status: 500 });
        }

        for (const bike of bikes) {
            try {
                // Upload all images
                const imageAssets = [];
                // Use the new proper 'images' array if available, otherwise fallback to legacy single 'imageUrl'
                const sources = bike.images && bike.images.length > 0 ? bike.images : (bike.imageUrl ? [bike.imageUrl] : []);

                for (const src of sources) {
                    try {
                        const assetId = await uploadImageToSanity(src);
                        imageAssets.push({
                            _type: 'image',
                            _key: Math.random().toString(36).substring(7), // Unique key required by Sanity
                            asset: {
                                _type: 'reference',
                                _ref: assetId,
                            },
                        });
                    } catch (err: any) {
                        console.error(`Failed to upload one image for ${bike.title}`, err);
                    }
                }

                // Create document
                const doc = {
                    _type: 'motorcycle',
                    title: bike.title,
                    slug: { _type: 'slug', current: bike.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
                    price: bike.price,
                    brand: bike.title.split(' ')[0].toUpperCase(), // Simple extraction
                    year: bike.year,
                    displacement: 0, // Placeholder
                    isUsed: true,
                    kilometers: bike.kilometers,
                    images: imageAssets,
                    description: `Scraped from Moto.it. Original Link: ${bike.externalUrl}`,
                };

                const created = await client.create(doc);
                results.push({ title: bike.title, status: 'success', id: created._id });

            } catch (error: any) {
                console.error(`Failed to import ${bike.title}:`, error);

                // Specific check for Permission Error
                if (error.statusCode === 403 || error.message?.includes('Insufficient permissions')) {
                    return NextResponse.json({
                        error: 'Permission Denied! Your SANITY_API_TOKEN is likely a "Viewer" token. Please update .env.local with a "Editor" token.'
                    }, { status: 403 });
                }

                results.push({ title: bike.title, status: 'error', error: error.message });
            }
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
