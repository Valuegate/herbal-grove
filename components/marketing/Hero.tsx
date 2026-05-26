import Image from "next/image";
import Img from "@/components/marketing/img.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Hero — main landing section with headline, subtext, CTA, trust avatars,
 * and the HerbScanCard on the right. Subtle mint background with
 * a decorative prismatic flowing wave.
 */

const avatars = [
  { src: "https://i.pravatar.cc/80?img=47", alt: "User avatar 1" },
  { src: "https://i.pravatar.cc/80?img=32", alt: "User avatar 2" },
  { src: "https://i.pravatar.cc/80?img=12", alt: "User avatar 3" },
  { src: "https://i.pravatar.cc/80?img=25", alt: "User avatar 4" },
  { src: "https://i.pravatar.cc/80?img=56", alt: "User avatar 5" },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #f7faf7 0%, #f9fcf9 45%, #f5f9f5 100%)",
      }}
    >
      {/* Decorative background wave — local Figma asset */}
      <img
        src="/images/HerbaGrovebackground.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      <div className="relative z-10 section-padding pt-32 pb-16 md:pt-[150px] md:pb-24 flex flex-col md:flex-row items-center gap-10 md:gap-14">
        {/* Left column — text */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8">
          <h1 className="font-heading font-medium text-3xl md:text-[40px] lg:text-[64px] leading-tight md:leading-15 lg:leading-20 text-foreground">
            Understand herbs with{" "}
            <span className="font-bold text-brand-700">AI and Experts</span>
          </h1>

          <p className="font-body text-base md:text-lg lg:text-xl text-body-text leading-6 lg:leading-7 max-w-135">
            Identify herbs from images, explore verified herbal knowledge, and
            get trusted guidance — all in one place.
          </p>

          <Link href="/sign-up">
            <Button
              size="lg"
              className="rounded-full bg-brand-primary hover:bg-brand-700 text-white font-bold text-xl px-12 py-6 h-auto shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)] w-fit cursor-pointer"
            >
              Get Started
            </Button>
          </Link>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center flex-shrink-0">
              {avatars.map((avatar, i) => (
                <Image
                  key={avatar.src}
                  src={avatar.src}
                  width={40}
                  height={40}
                  alt={avatar.alt}
                  className={`w-10 h-10 rounded-full ring-2 ring-white object-cover ${
                    i > 0 ? "-ml-2" : ""
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-neutral-800 text-sm">
              Trusted by 4,000+ people
            </span>
          </div>
        </div>

        {/* Right column — HerbScanCard */}
        <div className="w-full max-w-105 md:max-w-[50%] lg:w-120 lg:max-w-none shrink-0">
          <Image src={Img} alt="Image" />
        </div>
      </div>
    </section>
  );
}
