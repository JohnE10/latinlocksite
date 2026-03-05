// app/api/convert-address/route.ts
import { NextResponse } from "next/server";
import { translateAddress } from "@/lib/translateAddress";
import { semanticJudge } from "@/lib/semanticJudge";
import { placesApiAddress } from '@/lib/placeApiAddress';
import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

function isRateLimited(ip: string): boolean {
  const count = rateLimitCache.get(ip) ?? 0;
  if (count >= 10) return true;
  rateLimitCache.set(ip, count + 1);
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { address } = await req.json();

    if (!address || typeof address !== "string" || address.trim().length === 0) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }
    if (address.length > 300) {
      return NextResponse.json({ error: "Address too long" }, { status: 400 });
    }

    // AI translation + Places API in parallel
    const [translatedAddress, placesRes] = await Promise.all([
      translateAddress(address),
      placesApiAddress(address),
    ]);
    let finalAddress = translatedAddress;

    // semantic judgment
    if (placesRes) {
      const semanticJudgeRes = await semanticJudge(
        translatedAddress,
        placesRes
      );

      if (semanticJudgeRes) {
        return NextResponse.json({
          formatted_address: finalAddress,
          mapAddress: placesRes,
        });
      }
    }


    // Geocoding API
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.GEOCODING_API_KEY}`
    );

    const geoJson = await geoRes.json();

    const geocodedAddress =
      geoJson.results?.[0]?.formatted_address || null;

    // Search for ROOFTOP location_type in all results
    let selectedResult = null;
    if (geoJson.results && geoJson.results.length > 0) {
      // First, try to find ROOFTOP
      selectedResult = geoJson.results.find(
        (result: any) => result.geometry?.location_type === "ROOFTOP"
      );

      // If no ROOFTOP found, use the first result
      if (!selectedResult) {
        selectedResult = geoJson.results[0];
      }
    }

    // Extract location data
    let locationData = null;
    if (selectedResult?.geometry) {
      locationData = {
        lat: selectedResult.geometry.location.lat,
        lng: selectedResult.geometry.location.lng,
        location_type: selectedResult.geometry.location_type,
        geocodingSelectedAddress: selectedResult?.formatted_address
      };
    }

    console.log('tbd address conversion:', {
      geocodedAddress,
      translatedAddress,
      finalAddress,
      locationData
    });

    return NextResponse.json({
      formatted_address: finalAddress,
      location: locationData,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Address conversion failed" },
      { status: 500 }
    );
  }
}