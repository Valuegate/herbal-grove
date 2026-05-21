"use client";

import Link from "next/link";
import { ForgotPasswordBrandSection } from "@/components/forgotpassword/FPBrandsection";
import { ForgotPasswordForm } from "../forgotpassword/ForgotPasswordForm";
import bgImage from "@/components/signup/bg-signup.png";

export const ForgotPassword = () => {
  return (
    <main className="w-full min-h-screen pt-20 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${bgImage.src})` }}>
      {/* Back to Home Button */}
      <Link
        href="/">
        <button 
          type="button"
          className="fixed top-4 left-4 md:absolute md:top-6 md:left-6 sm:top-8 sm:left-8 bg-white text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg z-50 text-sm font-bold tracking-wide"
        >
          Back to Home
        </button>
      </Link>

      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[1000px] gap-8 lg:gap-0">
        {/* Left Card - Branding */}
        <div className="z-0 w-full lg:w-[400px] rounded-[2rem] shadow-xl overflow-hidden lg:h-[500px] bg-white/80 mb-6 lg:mb-0 lg:-mr-[30px] lg:pr-[30px]">
          <ForgotPasswordBrandSection />
        </div>

        {/* Right Card - Form */}
        <div 
          className="z-10 w-full lg:w-[500px] rounded-[2rem] shadow-2xl overflow-hidden bg-[#FAFAFA] min-h-[40px]"
        >
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
};
