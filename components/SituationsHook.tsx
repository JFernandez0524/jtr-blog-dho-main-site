export default function SituationsHook() {
  const situations = [
    {
      title: "Inherited Property",
      description: "You've inherited a home and need to understand your options for managing or selling the property.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: "Foreclosure",
      description: "You're facing financial hardship and need guidance on protecting your equity before it's too late.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Financial Hardship",
      description: "Life circumstances have changed and you need to explore all your options for your home.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-remax-slate/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center mb-12">Are You Facing One of These Situations?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {situations.map((situation) => (
            <div
              key={situation.title}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-remax-blue/10 rounded-lg flex items-center justify-center text-remax-blue mb-4">
                {situation.icon}
              </div>
              <h3 className="text-xl font-semibold text-remax-blue mb-3">
                {situation.title}
              </h3>
              <p className="text-remax-slate/80">{situation.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
