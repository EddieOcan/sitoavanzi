# Avanzi Moto - Website

Modern, responsive website for Avanzi Moto dealership built with Next.js 15, Sanity CMS, and Tailwind CSS.

## Features

- 🏍️ Dynamic brand pages (KTM, Husqvarna, Voge, Kymco, Beta, Fantic, Piaggio, Ducati, BMW)
- 🔄 Real-time motorcycle inventory management via Sanity CMS
- 🎨 Modern, dark-themed UI with glassmorphism effects
- 📱 Fully responsive with custom mobile navigation
- ⚡ Optimized for performance with Next.js 15
- 🎯 Smart filtering system for motorcycles
- 🌈 Brand-specific color theming

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Outfit (Google Fonts)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/EddieOcan/avanzi.git
cd avanzi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Sanity credentials:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=your_dataset
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Sanity Studio

Access the Sanity Studio at `/studio` to manage motorcycle inventory.

## Deployment

This project is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/EddieOcan/avanzi)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── [brand]/        # Dynamic brand pages
│   ├── usato/          # Used motorcycles page
│   └── studio/         # Sanity Studio
├── components/         # React components
│   └── ui/            # Reusable UI components
├── lib/               # Utilities and helpers
└── sanity/            # Sanity configuration and schemas
```

## License

© 2024 Avanzi Moto. All rights reserved.
