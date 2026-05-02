import { NextResponse } from 'next/server';

const LATINLOCK_DESTINATION_URL = 'https://apps.shopify.com/latinlock';
const GA_MEASUREMENT_ID = 'G-282VT6K98Y';

// This GET handler replaces the previous redirect page so `/go/latinlockListing`
// can redirect without rendering the site Header/Footer layout.
export async function GET(request) {
  // Fire a server-side GA4 event before redirecting so click attribution does
  // not depend on browser timing or client-side script execution.
  const measurementProtocolSecret = process.env.GA4_API_SECRET;
  const clientId = request.cookies.get('_ga')?.value?.split('.').slice(2).join('.') || '555.555';

  if (measurementProtocolSecret) {
    const url = new URL(request.url);

    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${measurementProtocolSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name: 'go_redirect_click',
              params: {
                redirect_key: 'latinlockListing',
                from_path: url.pathname,
                destination_url: LATINLOCK_DESTINATION_URL,
              },
            },
          ],
        }),
      }
    );
  }

  return NextResponse.redirect(LATINLOCK_DESTINATION_URL, 307);
}