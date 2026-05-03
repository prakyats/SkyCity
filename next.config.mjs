import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,

  // ── Turbopack root — silences the "multiple lockfiles" workspace warning ──
  // Points Turbopack to this project directory, not a parent folder.
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
      // Security headers — all environments
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // ── Long-lived cache headers — production only ─────────────────────────
      // In dev, Next.js manages its own Cache-Control for /_next/static and
      // setting a custom one breaks HMR. Vercel sets these automatically in
      // production so this block only needs to run in non-dev environments.
      ...(!isDev ? [
        {
          source: '/_next/static/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/fonts/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
      ] : []),
    ];
  },
};

export default nextConfig;
