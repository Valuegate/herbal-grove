import Image from "next/image";
import Morter from "@/components/signup/morter.png";

function LeafLogo() {
  return (
    <svg width="32" height="32" viewBox="0 3 32 32" fill="none">
      <path d="M16 4C21 6 25 10 25 15C25 20 21 24 16 24L16 4Z" fill="#1a7a1e" />
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
    <div className="p-5 flex flex-col items-center justify-center h-full text-center">
      <div className="mb-8 flex items-center space-x-2">
        <LeafLogo />
        <span className="font-bold text-2xl text-[#1a7a1e]">HerbaGrove</span>
      </div>

      <div className="mb-2">
        <h2 className="text-3xl font-extrabold text-black mb-3">
          Welcome Back!
        </h2>
        <p className="text-gray-600 max-w-[280px] mx-auto leading-relaxed">
          &ldquo;Nature&apos;s wisdom, AI&apos;s Precision. Discover the power of botanical
+          healing personalized for your unique needs.&rdquo;
        </p>
      </div>

      <div className="mt-3 mb-3 flex justify-center w-full max-w-[220px]">
        <Image
          src={Morter}
          alt="Mortar and Pestle"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
