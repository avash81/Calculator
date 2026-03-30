export default function CalcLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6
                     animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-48 mb-4"/>
      <div className="h-7 bg-gray-200 rounded w-2/3 mb-2"/>
      <div className="h-4 bg-gray-200 rounded w-full mb-6"/>
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div className="border border-gray-100 rounded-xl
                         p-5 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-24"/>
          <div className="h-10 bg-gray-200 rounded"/>
          <div className="h-2 bg-gray-200 rounded"/>
        </div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-200 rounded-xl"/>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-gray-200 rounded-xl"/>
            <div className="h-16 bg-gray-200 rounded-xl"/>
          </div>
        </div>
      </div>
    </div>
  );
}
