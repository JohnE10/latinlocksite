/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/ecommerce-shipping-trends-2025',
        destination: '/blog/ecommerce-shipping-trends-2025',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/checkout-mistakes-cost-shopify-sales',
        destination: '/blog/checkout-mistakes-cost-shopify-sales',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/non-latin-addresses-carrier-issues',
        destination: '/blog/non-latin-addresses-carrier-issues',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
      {
        source: '/prevent-non-latin-characters-in-shopify-shipping-address',
        destination: '/blog/prevent-non-latin-characters-in-shopify-shipping-address',
        permanent: true,
        basePath: false,
        has: [{ type: 'host', value: 'latinlockblog.stackorbithq.com' }],
      },
    ];
  },
};

module.exports = nextConfig;