/**
 * WhatHerbaDoes — four feature cards showing core platform capabilities.
 * Each card has an icon badge, label, title, description, stat, and CTA link.
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

const features = [
  {
    label: "AI-POWERED",
    title: "Identify herbs with AI guidance",
    desc: "Snap a photo and get AI-guided insights into what the herb is and how it's commonly used.",
    stat: "94%",
    statText: "identification accuracy across 500+ herb species",
    cta: "Try a scan →",
    icon: (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="9" width="24" height="17" rx="3" stroke="#414651" strokeWidth="2" />
        <circle cx="16" cy="17" r="5" stroke="#414651" strokeWidth="2" />
        <path d="M12 9L13.5 6H18.5L20 9" stroke="#414651" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "EXPERT-REVIEWED",
    title: "Understand safety before use",
    desc: "Review safety notes, interactions, and common usage considerations for each herb.",
    stat: "100+",
    statText: "Herbs reviewed by certified consultants",
    cta: "See safety scores →",
    icon: (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L6 8V16C6 21 10.5 25.5 16 28C21.5 25.5 26 21 26 16V8L16 4Z" stroke="#414651" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11 16L14 19L21 12" stroke="#1a7a1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "ASK A CONSULTANT",
    title: "Ask a Consultant",
    desc: "Ask questions and get clarification from a verified expert when you're unsure.",
    stat: "<2hr",
    statText: "average consultant response time",
    cta: "Chat with a consultant →",
    icon: (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="#414651" strokeWidth="2" />
        <path d="M6 26C6 21.5 10.5 18 16 18C21.5 18 26 21.5 26 26" stroke="#414651" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "KNOWLEDGE BASED",
    title: "Explore research-based herb guides",
    desc: "Learn about herbs through curated guides grounded in traditional use and modern research.",
    stat: "50+",
    statText: "detailed herb guides and growing",
    cta: "Explore the library →",
    icon: (
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
        <path d="M4 3H16V17H4V3Z" stroke="#414651" strokeWidth="1.5" />
        <path d="M10 3V17" stroke="#414651" strokeWidth="1.5" />
        <path d="M4 17C4 17 7 15.5 10 17C13 18.5 16 17 16 17" stroke="#414651" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function WhatHerbaDoes() {
  return (
    <section id="what-herbagrove-does" className="bg-white section-padding py-24">
      <div className="content-width flex flex-col gap-20">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <LeafIcon />
            <span className="text-brand-primary font-semibold text-xl">
              WHAT HERBAGROVE DOES
            </span>
          </div>
          <h2 className="font-heading font-medium text-3xl md:text-[40px] leading-tight md:leading-[60px]">
            Everything you need to use herbs{" "}
            <span className="text-brand-primary">with confidence</span>
          </h2>
          <p className="text-xl text-body-text max-w-[628px]">
            From AI-powered herb scanning to expert-reviewed safety guidance —
            everything you need in one place.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-[20px] shadow-[0_0_4px_0_rgba(0,0,0,0.25)] p-8 flex flex-col gap-8"
            >
              {/* Card header */}
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-badge rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <span className="bg-badge rounded-xl px-3 py-1 font-heading font-semibold text-xs text-brand-700 uppercase">
                  {feature.label}
                </span>
              </div>

              {/* Card content */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-2xl text-neutral-800">
                  {feature.title}
                </h3>
                <p className="text-base text-neutral-800">{feature.desc}</p>
              </div>

              {/* Stat row */}
              <div className="bg-badge rounded-lg px-4 py-2 flex items-center gap-3">
                <span className="font-light italic text-2xl text-brand-700">
                  {feature.stat}
                </span>
                <span className="text-xs text-body-text">
                  {feature.statText}
                </span>
              </div>

              {/* CTA link */}
              <span className="font-heading font-semibold text-base text-brand-700 cursor-pointer hover:underline">
                {feature.cta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
