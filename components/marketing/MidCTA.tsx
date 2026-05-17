import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * MidCTA — mid-page call-to-action banner encouraging first herb scan.
 * Full-width subtle green background with headline and button.
 */
export default function MidCTA() {
  return (
    <section className="bg-brand-transparent min-h-[280px] lg:h-[400px] flex items-center">
      <div className="content-width section-padding flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 py-16 lg:py-0">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-black">
            Not sure where to start?
          </h2>
          <p className="text-lg md:text-xl text-neutral-800">
            Scan your first herb for free and see how HerbaGrove guides you,
            step by step.
          </p>
        </div>
        <Link href="/sign-up">
          <Button className="bg-brand-primary hover:bg-brand-700 text-white rounded-full px-8 py-3 text-base font-medium shrink-0 h-12 cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
