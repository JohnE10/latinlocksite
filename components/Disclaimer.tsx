// components/Disclaimer.tsx
export default function Disclaimer() {
    return (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 flex flex-col items-start gap-2">

            <p>
                ⚠️ This tool helps convert addresses that contain non-Latin characters, but results may vary. Always review the final address to ensure accurate delivery.

            </p>
            <p>
                The most reliable approach is having customers enter addresses in Latin characters at checkout, reducing errors and failed deliveries. LatinLock helps enforce this automatically for Shopify stores.

            </p>
        </div>
    );
}