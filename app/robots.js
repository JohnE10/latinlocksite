// app/robots.js

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // Added sitemap location so crawlers can reliably discover LatinLock URLs.
    sitemap: 'https://stackorbithq.com/sitemap.xml',
  };
}
