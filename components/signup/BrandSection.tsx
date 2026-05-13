import Image from "next/image";
import Morter from "@/components/signup/morter.png"

function LeafLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4C21 6 25 10 25 15C25 20 21 24 16 24L16 4Z"
        fill="#1a7a1e"
      />
      <path
        d="M16 6C11 6 7 10 7 15C7 20 11 24 16 24L16 6Z"
        fill="#1a7a1e"
        opacity="0.4"
      />
      <path
        d="M16 8L16 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 14C16 14 13 11 10 12"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16 18C16 18 19 15 22 16"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const BrandSection = () => {
  return (
    <div className="bg-transparent p-8 flex flex-col items-center justify-center relative w-full h-full">
      <div className="mb-8 flex items-center space-x-2">
        <LeafLogo />
        <span className="font-bold text-2xl text-brand-green ">HerbaGrove</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-black mb-3">Hello welcome</h2>
        <p className="text-gray-600 max-w-[280px] mx-auto leading-relaxed">
          "Nature's wisdom, AI's Precision. Discover the power of botanical healing personalized for your unique needs"
        </p>
      </div>

      <div className="mt-4 flex justify-center w-full max-w-[250px]">
        <Image 
          src={Morter} 
          alt="Morter" 
          className="w-full object-contain drop-shadow-2xl"/>
      </div>
    </div>
  )
}