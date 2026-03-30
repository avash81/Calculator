'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        An unexpected error occurred. Please try again or go back to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => reset()} className="btn btn-primary px-8 py-3">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary px-8 py-3">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
