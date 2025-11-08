# Anime Search App

Search and explore anime with instant results powered by the free [Jikan API](https://docs.api.jikan.moe/). The application provides a responsive search experience, server-side pagination, and rich detail pages for every title.

## Live Demo

- _Add your deployed URL here once published (e.g., Netlify / Vercel)._

## Tech Stack

- React 19 with Hooks
- TypeScript
- Vite (dev server configured for port `4000`)
- Redux Toolkit + React Redux
- React Router DOM
- Material UI 7

## Getting Started

### Prerequisites

- Node.js `>= 20.19.0`
- npm (the project uses npm exclusively)

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The dev server starts on **http://localhost:4000**.

### Build

```bash
npm run build
```

## Features

- Instant search with debounced API requests (250 ms) and in-flight request cancellation
- Server-side pagination backed by the Jikan API pagination metadata
- Detail pages with synopsis, production credits, airing info, ratings, and external links
- Global error and empty states plus helpful onboarding copy
- Responsive Material UI design with reusable components

## Bonus Implementation

- Creative, neon-cyber UI treatment with animated hero, expanding search bar, and Nintendo-inspired suggestion carousel
- Meaningful loading states (global spinners and layout-preserving placeholders) plus empty/no-results messaging
- Fully responsive layout (2-up cards on mobile, adaptive carousel counts, touch-friendly spacing)
- Additional discovery features: seasonal suggestions carousel with hover overlays and related-title gallery on detail view
- Robust error handling with user-friendly cards, graceful fallbacks, and race-condition protection via `AbortController`
- Direct access to trailers and external MyAnimeList pages when available

## Project Structure

```
src/
├── components/        # Reusable UI building blocks
├── features/          # Redux slices and domain logic
├── hooks/             # Custom hooks (debounce, typed Redux hooks)
├── pages/             # Route-level pages
├── services/          # API client helpers
├── store/             # Redux store configuration
└── types/             # Shared TypeScript types
```

## API

All data comes from the public Jikan REST API:

- `GET /v4/anime?q={query}&page={page}&limit={limit}` for search results
- `GET /v4/anime/{id}/full` for detailed anime information

## Deployment

The app is a static SPA and can be deployed to any static hosting provider (Netlify, Vercel, Render, GitHub Pages, etc.). After running `npm run build`, publish the generated `dist` directory. Remember to update the **Live Demo** link above once deployed.
