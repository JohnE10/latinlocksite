// components/AddressInputForm.tsx
"use client";

import { useState } from "react";

type LocationData = {
  lat: number;
  lng: number;
  location_type: string;
  geocodingSelectedAddress: string;
};

export default function AddressInputForm() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [mapAddress, setMapAdress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchQuality, setMatchQuality] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    setLocation(null);
    setMatchQuality(null);

    try {
      const res = await fetch("/api/convert-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Conversion failed");
      }
      else {
        setOutput(data.translatedAddress);
        setLocation(data.location);
        setMapAdress(data.mapAddress);
        setMatchQuality(data.match_quality);
      }


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

  function getLocationTypeHeading(locationType: string): string {
    switch (locationType) {
      case "ROOFTOP":
        return "Exact Match";
      case "RANGE_INTERPOLATED":
        return "Approximate Location (Interpolated)";
      case "GEOMETRIC_CENTER":
        return "Geometric Center";
      case "APPROXIMATE":
        return "Approximate Location";
      default:
        return `Location (${locationType})`;
    }
  }

  function getLocationTypeExplanation(locationType: string): string {
    switch (locationType) {
      case "Exact Match":
        return "Exact location: the result is a precise match to the input address.";
      case "Approximate":
        return "Approximate location: this map search result is a general estimate, used when the software cannot determine if Google found an exact match for the converted address.";
      default:
        return locationType && `Location type: ${locationType}`;
    }
  }

  console.log('tbd getLocationTypeExplanation(matchQuality):', getLocationTypeExplanation(matchQuality));

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="address" className="font-semibold">
          Enter Address (any language):
        </label>

        <textarea
          id="address"
          value={input}
          onChange={handleTextareaChange}
          placeholder="Ερμού 51, 105 63 ΑΘΗΝΑ, GREECE"
          rows={2}
          required
          disabled={loading}
          className="border rounded px-3 py-2 resize-none overflow-hidden"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {output && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center justify-between">
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
      )}

      {output && (
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-[18px]">

            <span>Google Maps Search:</span>{matchQuality === "Exact Match" ? <span className='text-green-700'> Exact Match</span> : <span className='text-red-600'> No Exact Match Found</span>}
          </h3>
          {!output.includes('Address not found') &&
            <>
              <p className="text-sm text-gray-600 mb-2">
                {getLocationTypeExplanation(matchQuality)}
              </p>
              <iframe
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${output}&zoom=17`}
              >
              </iframe>
            </>
          }

        </div>
      )}



      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <strong>Error:</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}