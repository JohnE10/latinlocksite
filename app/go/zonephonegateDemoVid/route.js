import { NextResponse } from 'next/server';

const ZONEPHONEGATE_DEMO_VIDEO_DESTINATION_URL = 'https://youtu.be/7YRITNaQtY8';
const GA_MEASUREMENT_ID = 'G-282VT6K98Y';

// This GET handler creates `/go/zonephonegateDemoVid` as a layout-free redirect route.
export async function GET(request) {
  // Fire the redirect click event server-side so analytics does not rely on client timing.
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
                redirect_key: 'zonephonegateDemoVid',
                from_path: url.pathname,
                destination_url: ZONEPHONEGATE_DEMO_VIDEO_DESTINATION_URL,
              },
            },
          ],
        }),
      }
    );
  }

  return NextResponse.redirect(ZONEPHONEGATE_DEMO_VIDEO_DESTINATION_URL, 307);
}
