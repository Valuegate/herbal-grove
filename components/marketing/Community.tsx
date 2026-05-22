"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Community — testimonial carousel showing user feedback.
 * Dark green background block with arrow navigation and rotating quotes.
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

const quotes = [
  {
    text: "\u201CI used to rely on scattered advice online without really knowing what to trust. Having safety notes and expert-reviewed guidance in one place helps me feel more confident before using an herb.\u201D",
    author: "\u2014 Sophia Reyes",
    role: "Home herbalist",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    text: "\u201CHerbaGrove helped me identify three herbs in my grandmother\u2019s garden that I had never been able to name. The AI scan was instant and the safety info was incredibly helpful.\u201D",
    author: "\u2014 Marcus Chen",
    role: "Amateur botanist",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    text: "\u201CAs a practitioner, I recommend HerbaGrove to my clients so they can do their own research safely. The quality of the information is genuinely impressive.\u201D",
<<<<<<< HEAD
    author: "\u2014 Dr. Nathan Smith",
=======
    author: "\u2014 Dr. Aisha Okonkwo",
>>>>>>> 8ebdb00697fe3b15c10ede1990286a97040dcccd
    role: "Naturopath",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
];

export default function Community() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () =>
    setActiveIndex((i) => (i - 1 + quotes.length) % quotes.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % quotes.length);

  const quote = quotes[activeIndex];

  return (
    <section className="bg-white section-padding py-24">
      <div className="content-width flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <LeafIcon />
            <span className="text-brand-primary font-semibold text-xl">
              REAL PEOPLE
            </span>
          </div>
          <h2 className="font-heading font-medium text-3xl md:text-[40px] leading-tight md:leading-[60px]">
            What the community is{" "}
            <span className="text-brand-primary">saying</span>
          </h2>
          <p className="text-lg md:text-xl text-body-text">
            Experiences from people using HerbaGrove to learn about herbs more
            safely
          </p>
        </div>

        {/* Testimonial block */}
        <div className="bg-brand-700 w-full min-h-[373px] flex items-center justify-center px-6 md:px-12 py-12 rounded-2xl">
          <div className="flex flex-col items-center gap-6 max-w-[900px] w-full">
            <span className="text-base text-white opacity-80">
              Community Feedback
            </span>

            {/* Quote row */}
            <div className="flex items-center gap-2 md:gap-4 w-full">
              <button
                onClick={prev}
                className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <p className="font-medium text-lg md:text-2xl leading-7 md:leading-8 text-white text-center w-full transition-opacity duration-300">
                {quote.text}
              </p>

              <button
                onClick={next}
                className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
                aria-label="Next testimonial"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-4">
              <Image
                src={quote.avatar}
                width={40}
                height={40}
                alt={quote.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-white text-base font-medium">
                  {quote.author}
                </span>
                <span className="text-white text-sm opacity-80">
                  {quote.role}
                </span>
              </div>
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex
                      ? "bg-white w-4"
                      : "bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
