/**
 * HowItWorks — four-step process section showing the scan-to-consult flow.
 * Left: headline + subtext. Right: steps card with icons.
 */

function LeafIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C21 6 25 10 25 15C25 20 21 24 16 24L16 4Z" fill="#1a7a1e" />
      <path d="M16 6C11 6 7 10 7 15C7 20 11 24 16 24L16 6Z" fill="#1a7a1e" opacity="0.4" />
      <path d="M16 8L16 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 14C16 14 13 11 10 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 18C16 18 19 15 22 16" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const steps = [
  {
    title: "Snap or upload a photo",
    desc: "Capture a clear image of the herb or label.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="9" width="24" height="17" rx="3" stroke="#414651" strokeWidth="2" />
        <circle cx="16" cy="17" r="5" stroke="#414651" strokeWidth="2" />
        <path d="M12 9L13.5 6H18.5L20 9" stroke="#414651" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "AI analyses the Herb",
    desc: "Suggests a likely match based on herbal research.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="8" width="20" height="16" rx="3" stroke="#414651" strokeWidth="2" />
        <circle cx="12" cy="16" r="2" fill="#1a7a1e" />
        <circle cx="20" cy="16" r="2" fill="#1a7a1e" />
        <path d="M12 8V6M20 8V6" stroke="#414651" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Review the safety score",
    desc: "See expert-reviewed safety and usage notes.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L6 8V16C6 21 10.5 25.5 16 28C21.5 25.5 26 21 26 16V8L16 4Z" stroke="#414651" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11 16L14 19L21 12" stroke="#1a7a1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Ask a herbal consultant",
    desc: "Get clarification from a verified expert if you're unsure.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="#414651" strokeWidth="2" />
        <path d="M6 26C6 21.5 10.5 18 16 18C21.5 18 26 21.5 26 26" stroke="#414651" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white section-padding py-24">
      <div className="content-width flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">
        {/* Left — headline */}
        <div className="flex-1 lg:max-w-[544px] flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <LeafIcon />
            <span className="text-brand-primary font-semibold text-xl">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="font-heading font-medium text-3xl md:text-[40px] leading-tight md:leading-[60px]">
            From photo to{" "}
            <span className="text-brand-primary">safe understanding</span> —
            step by step
          </h2>
          <p className="font-body text-base leading-6 text-body-text max-w-[412px]">
            Herbagrove connects AI speed with human expertise. Every scan
            follows the same trusted process — fast, clear, and safe.
          </p>
        </div>

        {/* Right — steps card */}
        <div className="bg-white rounded-2xl shadow-[0_0_30px_rgba(16,88,19,0.2)] px-8 md:px-12 py-12 md:py-18 flex flex-col gap-12 md:gap-16 flex-1 w-full lg:w-auto">
          {steps.map((step) => (
            <div key={step.title} className="flex items-center gap-6">
              <div className="w-16 h-16 bg-badge rounded-lg flex items-center justify-center flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-xl md:text-2xl text-neutral-700">
                  {step.title}
                </span>
                <span className="text-base text-black">{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
