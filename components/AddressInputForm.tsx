// components/AddressInputForm.tsx
"use client";

import { useState } from "react";

// Added: client-side free-tier guard for obvious multi-address input.
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

export default function AddressInputForm() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string | null>(null);
  const [mapAddress, setMapAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    setMapAddress(null);

    // Added: short-circuit before network call when user pasted multiple lines.
    if (hasMultipleAddresses(input)) {
      setError("Please enter one address only (free version).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/convert-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Added: return early on API errors so stale/invalid data is not rendered.
        setError(data.error || "Conversion failed");
        return;
      }

      setOutput(data?.translatedAddress);
      setMapAddress(data?.placesApiResult);

    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleTextareaChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    setInput(el.value);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mx-auto w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <label htmlFor="address" className="font-semibold">
          Enter Address (any script):
        </label>

        <textarea
          id="address"
          value={input}
          onChange={handleTextareaChange}
          placeholder="Ερμού 51, 105 63 ΑΘΗΝΑ, GREECE"
          rows={2}
          required
          disabled={loading}
          className="w-full border rounded px-3 py-2 resize-none overflow-hidden"
        />

        <p className="text-sm text-gray-500">Free version supports one address at a time.</p>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {output &&
        (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex flex-col items-start justify-between gap-2">

              <div className='flex flex-col justify-between items-start w-full'>
                {!output.includes('Address not found') ?
                  (
                    <div className='flex flex-col justify-between items-start w-full'>
                      <div className='flex justify-between items-end w-full'>
                        <strong>Converted Address:</strong>
                        <button
                          onClick={() => navigator.clipboard.writeText(output)}
                          title="Copy address"
                          className="text-blue-600 hover:text-blue-800 border border-blue-300 rounded p-1 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                      <p>{output}</p>
                    </div>

                  ) :
                  (
                    <div className='flex flex-col justify-between items-start w-full'>
                      <strong>Converted Address:</strong>
                      <p>Could not convert address.</p>
                    </div>

                  )
                }
              </div>


            </div>
          </div>
        )
      }

      {mapAddress ?
        (
          <div className="mt-4">
            <h3 className="font-bold mb-2 text-[18px]">
              <span>Closest address found on Google:</span>
            </h3>
            <p className='mb-4'>
              <span>{mapAddress}</span>
            </p>
            <iframe
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${mapAddress}&zoom=17`}
            >
            </iframe>
          </div>
        ) : output && !output.includes('Address not found') ? (
          <div className="mt-4">
            <h3 className="font-bold mb-2 text-[18px]">
              <span>Closest address found on Google:</span>
            </h3>
            <p>Address not found on Google.</p>
          </div>
        ) : ''
      }



      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <strong>Error:</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}