import React from 'react'

type Props = {
    motorcycle: {
        title: string
        description: string
        imageUrl?: string
        price: number
        brand: string
        year: number
        slug: string
    }
}

export default function StructuredData({ motorcycle }: Props) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Motorcycle',
        name: motorcycle.title,
        description: motorcycle.description,
        image: motorcycle.imageUrl,
        brand: {
            '@type': 'Brand',
            name: motorcycle.brand,
        },
        offers: {
            '@type': 'Offer',
            price: motorcycle.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `https://avanzimoto.it/moto/${motorcycle.slug}`, // Example URL
        },
        vehicleModelDate: motorcycle.year,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
