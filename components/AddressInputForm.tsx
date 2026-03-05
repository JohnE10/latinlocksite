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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    setLocation(null);

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
        setOutput(data.formatted_address);
        setLocation(data.location);
        setMapAdress(data.mapAddress);
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
      case "ROOFTOP":
        return "The map below is showing the exact location. This is very precise and points to the specific building or rooftop.";
      case "RANGE_INTERPOLATED":
        return "The map below is showing an estimated location along a street, based on nearby address data.";
      case "GEOMETRIC_CENTER":
        return "The map below is showing the center point of a larger area, like a city, region, or park.";
      case "APPROXIMATE":
        return "Approximate location: the result is a general estimate, used when the input is ambiguous.";
      default:
        return `Location type: ${locationType}`;
    }
  }

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
          placeholder="Κωνσταντίνος Παπαδόπουλος, Ερμού 51, 105 63 ΑΘΗΝΑ, GREECE"
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
          <strong>Converted Address:</strong>
          <p>{output}</p>
        </div>
      )}

      {location && (
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-[18px]">
            {/* {getLocationTypeHeading(location.location_type)} - {location.location_type !== "ROOFTOP" && <span> No exact match found. </span>} */}
            {location.location_type === "ROOFTOP" && <span>Google Maps Search:<span className='text-green-700'> Exact Match</span></span>}
            {location.location_type !== "ROOFTOP" && <span>Google Maps Search:<span className='text-red-600'> No exact match found. </span></span>}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {getLocationTypeExplanation(location.location_type)}
          </p>
          <iframe
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${location.geocodingSelectedAddress}&zoom=17`}

          ></iframe>
        </div>
      )}

      {mapAddress && (
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-[18px]">
            Google Maps Search: <span className='text-green-700'>{getLocationTypeHeading('ROOFTOP')}</span>
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {getLocationTypeExplanation('ROOFTOP')}
          </p>
          <iframe
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${mapAddress}&zoom=17`}

          ></iframe>
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