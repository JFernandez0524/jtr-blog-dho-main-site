export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-remax-blue/5 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-12 bg-remax-slate/10 rounded w-2/3 animate-pulse mb-4" />
          <div className="h-6 bg-remax-slate/10 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-remax-slate/10 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-remax-slate/10 rounded w-1/4 mb-3" />
              <div className="h-6 bg-remax-slate/10 rounded w-3/4 mb-3" />
              <div className="h-4 bg-remax-slate/10 rounded w-full mb-2" />
              <div className="h-4 bg-remax-slate/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
