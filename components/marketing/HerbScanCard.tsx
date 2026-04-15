import Image from "next/image";

/**
 * HerbScanCard — interactive-looking card showcasing the herb scanning feature.
 * Displays a sample scan result with safety score, traditional use, and status.
 */
export default function HerbScanCard() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.18)] overflow-hidden">
      {/* Header row */}
      <div className="p-5 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="5" height="5" rx="1" stroke="#1a7a1e" strokeWidth="1.5" />
            <rect x="16" y="3" width="5" height="5" rx="1" stroke="#1a7a1e" strokeWidth="1.5" />
            <rect x="3" y="16" width="5" height="5" rx="1" stroke="#1a7a1e" strokeWidth="1.5" />
            <path d="M16 16H21V21" stroke="#1a7a1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold text-base text-neutral-800">Herb Scan</span>
            <span className="text-xs text-neutral-700">Bacopa Monnieri Elixier</span>
          </div>
        </div>
        <div className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-pulse" />
      </div>

      {/* Herb image — mortar and pestle with herbs on white background */}
      <Image
        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
        width={480}
        height={260}
        className="w-full h-[260px] object-cover"
        alt="Mortar and pestle grinding herbs"
      />

      {/* Safety Score row */}
      <div className="flex justify-between items-center px-6 py-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <path d="M10 2L3 5V10C3 14 6.5 17.5 10 19C13.5 17.5 17 14 17 10V5L10 2Z" stroke="#1a7a1e" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 10L9 12L13 8" stroke="#1a7a1e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-base text-neutral-700">Safety Score</span>
        </div>
        <span className="font-bold text-base text-neutral-800">94%</span>
      </div>

      {/* Traditional Use row */}
      <div className="flex justify-between items-center px-6 py-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <path d="M4 3H16V17H4V3Z" stroke="#1a7a1e" strokeWidth="1.5" />
            <path d="M10 3V17" stroke="#1a7a1e" strokeWidth="1.5" />
            <path d="M4 17C4 17 7 15.5 10 17C13 18.5 16 17 16 17" stroke="#1a7a1e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-base text-neutral-700">Traditional Use</span>
        </div>
        <span className="font-bold text-base text-neutral-800">Meditation</span>
      </div>

      {/* Status row */}
      <div className="flex justify-between items-center px-6 py-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="w-6 h-6">
            <circle cx="10" cy="6" r="3.5" stroke="#1a7a1e" strokeWidth="1.5" />
            <path d="M3 17C3 13.5 6 11 10 11C14 11 17 13.5 17 17" stroke="#1a7a1e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-base text-neutral-700">Status</span>
        </div>
        <span className="font-bold text-base text-brand-primary">Expert Verified</span>
      </div>
    </div>
  );
}
