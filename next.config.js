/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',

  // Skip non-critical ESLint warnings (unused imports) during production build
  eslint: {
    ignoreDuringBuilds: true,
  },

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
              "img-src 'self' data: https: https://calcpro.com.np https://picsum.photos https://images.unsplash.com https://www.googletagmanager.com",
              "connect-src 'self' https://firestore.googleapis.com https://www.google-analytics.com https://analytics.google.com https://generativelanguage.googleapis.com https://firebaseinstallations.googleapis.com https://identitytoolkit.googleapis.com",
              "frame-src 'self' https://www.googletagmanager.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
      {
        source: '/calculator/:path*',
        headers: [{
          key: 'Cache-Control',
          value: 'public, max-age=86400, stale-while-revalidate',
        }],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
