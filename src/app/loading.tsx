export default function Loading() {
  return (
    <div className="min-h-screen bg-cp-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-64 bg-gray-200 rounded-3xl" />
        
        {/* Categories skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-gray-200 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
