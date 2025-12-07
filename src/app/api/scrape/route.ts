import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const bikes: any[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 10) { // Safety limit of 10 pages
            const url = page === 1
                ? 'https://dealer.moto.it/avanzimoto/Usato'
                : `https://dealer.moto.it/avanzimoto/Usato/pagina-${page}`;

            console.log(`Scraping page ${page}: ${url}`);

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!response.ok) {
                console.error(`Failed to fetch page ${page}: ${response.status}`);
                hasMore = false;
                continue;
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            const cards = $('.dlr-card');

            if (cards.length === 0) {
                hasMore = false;
                break;
            }

            const pageBikes: any[] = [];

            cards.each((_, element) => {
                const card = $(element);

                // Extract Title
                const link = card.find('.dlr-card__link');
                const fullTitle = link.attr('title') || '';
                const href = link.attr('href') || '';
                const dataTarget = link.attr('data-target') || ''; // e.g. #annuncio_9820726
                const id = dataTarget.replace('#annuncio_', '');

                // Clean title (remove " - Annuncio ...") and force UPPERCASE
                // Also remove year patterns like "(2020)" or "(2017 - 19)"
                let title = fullTitle.split(' - Annuncio')[0].trim().toUpperCase();
                title = title.replace(/\s*\(\d{4}.*?\)/g, '').trim();

                // Extract Price
                const priceText = card.find('.dlr-card__extrainfo__price').text().trim();
                const price = priceText ? parseFloat(priceText.replace(/[^0-9]/g, '')) : 0;

                // Extract Km and Year
                const metaItems = card.find('.dlr-card__meta__item');
                let kilometers = 0;
                let year = new Date().getFullYear();

                metaItems.each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.toLowerCase().includes('km')) {
                        kilometers = parseFloat(text.replace(/[^0-9]/g, '')) || 0;
                    } else if (text.toLowerCase().includes('del') || text.match(/[0-9]{4}/)) {
                        const yearMatch = text.match(/([0-9]{4})/);
                        if (yearMatch) {
                            year = parseInt(yearMatch[1]);
                        }
                    }
                });

                // Extract Main Image (Fallback)
                const imgElement = card.find('.dlr-card__image__imagefile');
                let imageUrl = imgElement.attr('src') || imgElement.attr('data-src') || '';
                if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;

                if (title) {
                    // Avoid duplicates in global list
                    if (!bikes.some(b => b.title === title)) {
                        pageBikes.push({
                            id,
                            title,
                            price,
                            kilometers,
                            year,
                            imageUrl, // Main image
                            images: [imageUrl], // Default to main image, will be populated with gallery
                            externalUrl: href.startsWith('http') ? href : `https://dealer.moto.it${href}`,
                            imported: false
                        });
                    }
                }
            });

            // Fetch details for all bikes on this page (Concurrent limit: 5)
            const CONCURRENCY = 5;
            for (let i = 0; i < pageBikes.length; i += CONCURRENCY) {
                const chunk = pageBikes.slice(i, i + CONCURRENCY);
                await Promise.all(chunk.map(async (bike) => {
                    if (!bike.id) return;
                    try {
                        const detailUrl = `https://dealer.moto.it/avanzimoto/Detail/Detail?ID=${bike.id}`;
                        const detailRes = await fetch(detailUrl, {
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                        });
                        if (detailRes.ok) {
                            const detailHtml = await detailRes.text();
                            // regex to find var annuncio_{id} = [...];
                            const regex = new RegExp(`var annuncio_${bike.id}\\s*=\\s*(\\[.*?\\]);`, 's');
                            const match = detailHtml.match(regex);
                            if (match && match[1]) {
                                const json = JSON.parse(match[1]);
                                if (Array.isArray(json)) {
                                    // Extract hrefs from JSON
                                    bike.images = json.map((item: any) => item.href);
                                }
                            }
                        }
                    } catch (e) {
                        console.error(`Failed to fetch detail for ${bike.id}`, e);
                    }
                }));
            }

            bikes.push(...pageBikes);
            page++;
            // Optional: small delay to be nice?
            // await new Promise(r => setTimeout(r, 500));
        }

        return NextResponse.json({ bikes });

    } catch (error: any) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
