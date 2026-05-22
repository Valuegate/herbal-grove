"use client";

import Link from "next/link";
import { BrandSection } from "@/components/login/LoginBrandSection";
import { LoginForm } from "@/components/login/LoginForm";
import bgImage from "@/components/signup/bg-signup.png";

export const Login = () => {
  return (
    <main
<<<<<<< HEAD
      className="w-full min-h-screen flex items-center justify-center pt-20 p-4 md:p-8 lg:p-20 bg-cover bg-center bg-no-repeat relative"
=======
      className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-20 bg-cover bg-center bg-no-repeat relative"
>>>>>>> 8ebdb00697fe3b15c10ede1990286a97040dcccd
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      {/*Back to Home Button */}
      <Link
        href="/">
        <button 
          type="button"
<<<<<<< HEAD
          className="fixed top-4 left-4 md:absolute md:top-6 md:left-6 sm:top-8 sm:left-8 bg-white text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg z-50 text-sm font-bold tracking-wide"
=======
          className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg z-50 text-sm font-bold tracking-wide"
>>>>>>> 8ebdb00697fe3b15c10ede1990286a97040dcccd
        >
          Back to Home
        </button>
      </Link>

<<<<<<< HEAD
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[1000px] gap-8 lg:gap-0 ">
=======
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[1000px] gap-8 lg:gap-0">
>>>>>>> 8ebdb00697fe3b15c10ede1990286a97040dcccd
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
