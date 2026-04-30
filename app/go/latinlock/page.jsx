// app/go/latinlock/page.jsx
'use client';

import { useEffect } from 'react';

export default function GoLatinlock() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://apps.shopify.com/latinlock';
    }, 150); // small delay so GA can register pageview

    return () => clearTimeout(timer);
  }, []);

  return null;
}