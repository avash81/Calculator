import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 — Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The calculator or page you are looking for doesn&apos;t exist or has been moved.
      </p>
      
      <div className="w-full max-w-md mb-8">
        <Link href="/search" className="block w-full py-4 px-6 bg-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors">
          Search for a calculator...
        </Link>
      </div>

      <div className="text-sm text-gray-500 mb-4">Popular tools:</div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['Income Tax', 'EMI', 'BMI', 'Nepali Date'].map(tool => (
          <Link key={tool} href={`/search?q=${tool.toLowerCase()}`} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold hover:bg-blue-100">
            {tool}
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn btn-primary px-8 py-3">
          Go to Home
        </Link>
        <Link href="/calculator" className="btn btn-secondary px-8 py-3">
          Browse All Tools
        </Link>
      </div>
    </div>
  );
}
