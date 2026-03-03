/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx'],
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
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
        destination: '/latinlock/blog/non-latin-addresses-carrier-issues',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
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