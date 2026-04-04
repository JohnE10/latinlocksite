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

// check if address is cached, if not then translate
async function getTranslatedAddress(address: string): Promise<string> {

  const cached = aiCache.get(address);

  if (cached) {
    console.log('AI cache hit:', cached);
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

    // AI translation + Places API in parallel
    const [translatedAddress, result] = await Promise.all([
      getTranslatedAddress(address),
      placesApiAddress(address),
    ]);

    return NextResponse.json({
      translatedAddress,
      placesApiResult: result ?? null,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Address conversion failed" },
      { status: 500 }
    );
  }
}