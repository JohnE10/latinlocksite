// components/GA4.js
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-282VT6K98Y'; // Replace with your GA4 ID

export default function GA4() {
  const pathname = usePathname();

  useEffect(() => {
    // Load GA script if it hasn't been loaded yet
    if (!window.gtag) {
      const script1 = document.createElement('script');
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', { page_path: '${pathname}' });
      `;
      document.head.appendChild(script2);
    } else {
      // Track SPA navigation
      window.gtag('config', GA_MEASUREMENT_ID, { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
