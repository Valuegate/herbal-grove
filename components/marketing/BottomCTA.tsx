import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * BottomCTA — final call-to-action before the footer.
 * Centered headline with "confidence" in brand color and a prominent CTA button.
 */
export default function BottomCTA() {
  return (
    <section className="bg-brand-transparent min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-12 section-padding py-16">
        <h2 className="font-heading font-medium text-3xl md:text-[40px] leading-tight md:leading-[60px]">
          Start using herbs with{" "}
          <span className="text-brand-primary font-semibold">confidence</span>
        </h2>
        <p className="text-lg md:text-xl text-neutral-800">
          Get guided, expert-reviewed information — whenever you&apos;re unsure.
        </p>
        <Link href="/sign-up">
          <Button className="bg-brand-primary hover:bg-brand-700 text-white rounded-full px-12 py-4 text-xl font-bold h-12 cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
