// app/api/convert-address/route.ts
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { translateAddress } from "@/lib/translateAddress";
import { placesApiAddress } from '@/lib/placeApiAddress';
import { LRUCache } from 'lru-cache';

// Added: explicit runtime for predictable server behavior in production.
export const runtime = "nodejs";

// Added: bounded request-size guard for this free endpoint.
const MAX_CONTENT_LENGTH_BYTES = 4 * 1024;

// Rate limiting cache (in-memory baseline for free tier).
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

// In-memory AI cache for repeated free-tier queries.
const aiCache = new LRUCache<string, string>({
  max: 1000, // store up to 1000 addresses
  ttl: 24 * 60 * 60 * 1000, // 1 day
});

// Added: normalize user input to reduce cache misses and improve validation consistency.
function normalizeAddressInput(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

// Added: free-tier guard to reject obvious multi-address input.
function hasMultipleAddresses(raw: string): boolean {
  const nonEmptyLines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // Multiple non-empty lines is treated as multiple addresses.
  if (nonEmptyLines.length > 1) return true;

  const compact = raw.replace(/\s+/g, " ").trim();

  // Added: detect multiple postal-code groups in one line (common when users paste two addresses).
  const postalCodeMatches = compact.match(/\b\d{3,6}(?:\s\d{2,4})?\b/g) ?? [];

  // Added: require multiple commas as a second signal to reduce false positives.
  const commaCount = (compact.match(/,/g) ?? []).length;

  return postalCodeMatches.length > 1 && commaCount >= 2;
}

// Added: safer client-IP extraction for common proxy headers.
function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// check if address is cached, if not then translate
async function getTranslatedAddress(address: string): Promise<string> {
  const cached = aiCache.get(address);

  if (cached) {
    return cached;
  }

  const translated = await translateAddress(address);
  aiCache.set(address, translated);

  return translated;
}

// Added: standardized error payload for easier observability/client handling.
function jsonError(message: string, status: number, requestId: string) {
  return NextResponse.json({ error: message, requestId }, { status });
}

export async function POST(req: Request) {
  const requestId = randomUUID();

  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return jsonError("Too many requests. Please try again later.", 429, requestId);
    }

    // Added: reject oversized payloads early.
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH_BYTES) {
      return jsonError("Payload too large", 413, requestId);
    }

    // Added: require JSON requests for predictable parsing behavior.
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonError("Content-Type must be application/json", 415, requestId);
    }

    const body = await req.json();
    const rawAddress = typeof body?.address === "string" ? body.address : "";

    if (!rawAddress.trim()) {
      return jsonError("Address is required", 400, requestId);
    }

    if (hasMultipleAddresses(rawAddress)) {
      return jsonError("Please enter one address only", 400, requestId);
    }

    const address = normalizeAddressInput(rawAddress);

    if (address.length > 300) {
      return jsonError("Address too long", 400, requestId);
    }

    // AI translation + Places API in parallel
    const [translatedAddress, result] = await Promise.all([
      getTranslatedAddress(address),
      placesApiAddress(address),
    ]);

    return NextResponse.json({
      translatedAddress,
      placesApiResult: result ?? null,
      requestId,
    });
  } catch (err) {
    // Added: include requestId in server logs for easier production debugging.
    console.error("convert-address failed", { requestId, error: err });
    return jsonError("Address conversion failed", 500, requestId);
  }
}