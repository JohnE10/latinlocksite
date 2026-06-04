import { NextResponse } from 'next/server';

const ZONEPHONEGATE_SHOP_FORUM_DESTINATION_URL = 'https://youtu.be/LhyGZIZAQcY';
const GA_MEASUREMENT_ID = 'G-282VT6K98Y';

// This GET handler creates `/go/zonephonegateShopForum` for Shopify Forum video click tracking.
export async function GET(request) {
  // Fire a server-side GA4 event with source/campaign labels before redirecting.
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
                redirect_key: 'zonephonegateShopForum',
                from_path: url.pathname,
                destination_url: ZONEPHONEGATE_SHOP_FORUM_DESTINATION_URL,
                source: 'shopify_forum',
                campaign: 'zonephonegate_demo',
              },
            },
          ],
        }),
      }
    );
  }

  return NextResponse.redirect(ZONEPHONEGATE_SHOP_FORUM_DESTINATION_URL, 307);
}
