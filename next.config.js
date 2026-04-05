/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Security + performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: " + 
              "https://calcpro.com.np " + 
              "https://picsum.photos " + 
              "https://images.unsplash.com " + 
              "https://www.googletagmanager.com " + 
              "https://firebasestorage.googleapis.com", // Firebase storage support
              "connect-src 'self' https://firestore.googleapis.com https://www.google-analytics.com https://analytics.google.com https://generativelanguage.googleapis.com https://firebaseinstallations.googleapis.com https://identitytoolkit.googleapis.com",
              "frame-src 'self' https://www.googletagmanager.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Cache aggressively on the edge for generic assets, but validate
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        // Calculators should cache aggressively and seamlessly revalidate in the background
        source: '/calculator/:path*',
        headers: [{
          key: 'Cache-Control',
          value: 'public, max-age=86400, stale-while-revalidate=604800', // 1 day edge cache, 1 week stale cache
        }],
      },
      {
        // Static assets shouldn't change
        source: '/_next/static/:path*',
        headers: [{
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        }],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // Year long cache for generated optimized images
    remotePatterns: [
      {
        // Allow the platform administrator to use ANY CDN for blog image slots
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
