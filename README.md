# Visual Product Matcher - Backend

Express + Convex + Gemini + UploadThing backend for visual similarity search.

## Features
- Upload image (file or URL) to UploadThing and compute embeddings
- Store products with metadata and 1408-dim embeddings in Convex
- Vector search via Convex index
- Seed 50+ demo products

## Environment
Copy `.env.example` to `.env` and fill values:

- `GOOGLE_API_KEY`: Gemini API key (free tier)
- `CONVEX_URL`: Convex HTTP endpoint (e.g. https://xxx.convex.cloud)
- `UPLOADTHING_TOKEN`: UploadThing server token
- `PORT`: optional, default 3000

## Install & Run

```pwsh
pnpm install
pnpm dev
```

Health check: `GET /health`

Seed products:

```pwsh
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/products/seed -ContentType application/json -Body '{"count": 50}'
```

## API

- `POST /api/upload` multipart form-data `image` or JSON `{ imageUrl }` => `{ url, key, embedding }`
- `GET /api/products?category=shoes` => list
- `POST /api/search` body `{ imageUrl?, productId?, topK?, minScore? }` => results
- `POST /api/products/seed` body `{ count }`

## Deploy
- Any Node host (Render, Railway, Fly.io, Vercel) — set env vars.
- Ensure Convex deployment URL is reachable and schema deployed.
