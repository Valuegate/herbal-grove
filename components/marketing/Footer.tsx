import Link from "next/link";

/**
 * Footer — dark green footer with brand info, explore links, and legal links.
 * Three-column grid on desktop, single column on mobile.
 */

function LeafLogo() {
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

const exploreLinks = [
  { label: "Home", href: "#" },
  { label: "What you can do", href: "#what-herbagrove-does" },
  { label: "Safety", href: "#how-it-works" },
];

const legalLinks = [
  { label: "Terms of Use", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Disclaimer", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-800 min-h-[400px]">
      <div className="section-padding py-12">
        <div className="content-width grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-[120px]">
          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <LeafLogo />
              <span className="font-heading font-bold text-2xl text-brand-primary">
                Herbagrove
              </span>
            </div>
            <p className="text-lg md:text-xl text-white leading-7 max-w-[448px]">
              Herbal grove is an educational platform designed to support
              informed learning about herbs and traditional uses.
            </p>
          </div>

          {/* Explore column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-white">
              Explore
            </h3>
            <nav className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg md:text-xl text-white opacity-85 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-white">Legal</h3>
            <nav className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg md:text-xl text-white opacity-85 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <p className="text-white text-center">
          © Copyright 2026. All rights reserved by Herbamind. A Product by ValueGate Consulting.
        </p>
      </div>
    </footer>
  );
}
