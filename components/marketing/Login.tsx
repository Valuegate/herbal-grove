"use client";

import { BrandSection } from "@/components/login/LoginBrandSection";
import { LoginForm } from "@/components/login/LoginForm";
import bgImage from "@/components/signup/bg-signup.png";

export const Login = () => {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[1000px] gap-8 lg:gap-0">
        {/* Left column — Brand Section */}
        <div className="relative lg:z-0 w-full lg:w-[480px] rounded-[2rem] shadow-xl overflow-hidden h-auto lg:h-[480px] bg-white/90 lg:-mr-12">
          <BrandSection />
        </div>

        {/* Right column — Sign Up Form */}
        <div className="relative lg:z-10 w-full lg:w-[520px] rounded-[2rem] shadow-2xl overflow-hidden bg-white border border-gray-100 p-10 lg:p-12 lg:min-h-[600px]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
};
