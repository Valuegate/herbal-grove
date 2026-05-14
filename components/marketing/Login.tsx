"use client";

import Link from "next/link";
import { BrandSection } from "@/components/login/LoginBrandSection";
import { LoginForm } from "@/components/login/LoginForm";
import bgImage from "@/components/signup/bg-signup.png";

export const Login = () => {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-20 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      {/*Back to Home Button */}
      <Link
        href="/">
        <button 
          type="button"
          className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg z-50 text-sm font-bold tracking-wide"
        >
          Back to Home
        </button>
      </Link>

      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[1000px] gap-8 lg:gap-0">
        {/* Left column — Brand Section */}
        <div className="relative lg:z-0 w-full lg:w-[480px] rounded-[2rem] shadow-xl overflow-hidden h-auto lg:h-[55  0px] bg-white/90 lg:-mr-12">
          <BrandSection />
        </div>

        {/* Right column — Sign Up Form */}
        <div className="relative lg:z-10 w-full lg:w-[520px] rounded-[2rem] shadow-2xl overflow-hidden bg-white/95 border border-gray-100 backdrop-blur-sm p-10 lg:p-12 lg:min-h-[600px]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};
