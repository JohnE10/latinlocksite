// BackButton.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
    >
      ← Back
    </button>
  );
}