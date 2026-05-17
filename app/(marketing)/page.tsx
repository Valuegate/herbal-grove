import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import HowItWorks from "@/components/marketing/HowItWorks";
import WhatHerbaDoes from "@/components/marketing/WhatHerbaDoes";
import MidCTA from "@/components/marketing/MidCTA";
import Community from "@/components/marketing/Community";
import FAQ from "@/components/marketing/FAQ";
import BottomCTA from "@/components/marketing/BottomCTA";
import Footer from "@/components/marketing/Footer";

/**
 * Home page — public-facing marketing landing page.
 * Composes all marketing sections in order. No logic lives here.
 */
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhatHerbaDoes />
      <MidCTA />
      <Community />
      <FAQ />
      <BottomCTA />
      <Footer />
    </main>
  );
}
