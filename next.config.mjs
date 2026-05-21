// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Added: baseline security headers for production hardening.
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';

    const commonSecurityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      },
      // HSTS is added ONLY in production
      ...(isProduction
        ? [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ]
        : []),
    ];

    return [
      {
        source: '/:path*',
        headers: commonSecurityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://stackorbithq.com/latinlock/:path*',
        permanent: true,
        has: [{ type: 'host', value: 'latinlock.stackorbithq.com' }],
      },
      {
        source: '/',
        destination: '/latinlock/blog',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/ecommerce-shipping-trends-2025',
        destination: '/latinlock/blog/ecommerce-shipping-trends-2025',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/checkout-mistakes-cost-shopify-sales',
        destination: '/latinlock/blog/checkout-mistakes-cost-shopify-sales',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/non-latin-addresses-carrier-issues',
        destination: '/latinlock/blog/non-latin-shipping-address-problem',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      // Added redirect for the old broken primary-domain blog slug.
      {
        source: '/latinlock/blog/non-latin-addresses-carrier-issues',
        destination: '/latinlock/blog/non-latin-shipping-address-problem',
        permanent: true,
      },
      {
        source: '/prevent-non-latin-characters-in-shopify-shipping-address',
        destination: '/latinlock/blog/prevent-non-latin-characters-in-shopify-shipping-address',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/',
        destination: '/latinlock',
        permanent: true, // true = 301 redirect, false = 302
      },
    ];
  },
};

export default nextConfig;
