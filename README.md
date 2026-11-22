# VMV Design Groups — Vercel Deployment Package

Ready-to-deploy static + serverless architecture for **VMV Design Groups** (interactive Three.js 3D architectural visualizations, responsive layout, official logo, and serverless contact enquiry API).

## Project Structure

```text
vmv-design-groups-vercel/
├── index.html                 # Main responsive 3D website
├── vercel.json                # Security headers & immutable asset caching
├── package.json               # Local preview & Vercel CLI scripts
├── robots.txt                 # Search indexing config
├── api/
│   └── contact.js             # Vercel Serverless Function (POST /api/contact)
└── assets/
    ├── logo/
    │   └── vmv-logo.png       # Official VMV Design Groups logo
    └── images/                # Optimized architectural imagery
```

## Deploy to Vercel

### Option 1 — GitHub Import (Recommended)
1. Push this folder to a GitHub repository.
2. Open [vercel.com/new](https://vercel.com/new), import the repository, keep **Framework Preset: Other**, and click **Deploy**.

### Option 2 — Vercel CLI
```bash
npx vercel --prod
```

## Enable Live Email Delivery for the Contact Form
In your Vercel Dashboard, go to **Project Settings → Environment Variables** and add:
- `RESEND_API_KEY`: Your Resend API key
- `CONTACT_TO_EMAIL`: The verified VMV Design Groups inbox
- `CONTACT_FROM_EMAIL`: Your verified sender address (e.g. `VMV Website <noreply@yourdomain.com>`)

Until those variables are added, submissions still succeed and are logged in your Vercel Function Logs.
