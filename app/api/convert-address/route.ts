// app/api/convert-address/route.ts
import { NextResponse } from "next/server";
import { translateAddress } from "@/lib/translateAddress";
import { semanticJudge } from "@/lib/semanticJudge";
import { placesApiAddress } from '@/lib/placeApiAddress';
import { LRUCache } from 'lru-cache';
import { geocodeAddress } from "@/lib/geocode";

// Rate limiting cache
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

// In-memory AI cache
const aiCache = new LRUCache<string, string>({
  max: 1000, // store up to 1000 addresses
  ttl: 24 * 60 * 60 * 1000, // 1 day
});

async function getTranslatedAddress(address: string): Promise<string> {
  const cached = aiCache.get(address);

  if (cached) {
    return cached;
  }

  const translated = await translateAddress(address);

  aiCache.set(address, translated);

  return translated;
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

    // const result = await geocodeAddress(address);

    // AI translation + Places API in parallel
    const [translatedAddress, result] = await Promise.all([
      translateAddress(address),
      geocodeAddress(address),
    ]);

    if (result === null) {
      return NextResponse.json({
        formatted_address: "Address Not Found",
        match_quality: null,
        location_type: null,
      });
    } else {
      const englishAddress = result.englishAddress;
      // semantic judgment
      if (translatedAddress && englishAddress) {
        const semanticJudgeRes = await semanticJudge(
          translatedAddress,
          englishAddress
        );

        console.log('tbd convert-address vars:', { semanticJudgeRes, translatedAddress, englishAddress });

        if (semanticJudgeRes) {
          return NextResponse.json({
            translatedAddress,
            formatted_address: englishAddress,
            match_quality: result.matchQuality,   // "Exact Match" or "Approximate"
            location_type: result.locationType,   // "ROOFTOP", "RANGE_INTERPOLATED", etc.
          });
        }
        else {
          const result2 = await geocodeAddress(translatedAddress);
          console.log('tbd result2:', result2);
          if (result2) {
            const englishAddress2 = result2.englishAddress;
            const semanticJudgeRes2 = await semanticJudge(
              translatedAddress,
              englishAddress
            );

            if (semanticJudgeRes2) {
              return NextResponse.json({
                translatedAddress,
                formatted_address: englishAddress2,
                match_quality: result2.matchQuality,   // "Exact Match" or "Approximate"
                location_type: result2.locationType,   // "ROOFTOP", "RANGE_INTERPOLATED", etc.
              });
            }
          }
        }
      }
      return NextResponse.json({
        translatedAddress,
        formatted_address: translatedAddress,
        match_quality: null,
        location_type: null,
      });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Address conversion failed" },
      { status: 500 }
    );
  }
}