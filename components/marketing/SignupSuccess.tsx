"use client";

import Link from "next/link";
import Image from "next/image";
import bgImage from "@/components/signup/bg-signup.png";
import SuccessImage from "@/components/signup/ss.png";

type Props = {
  message?: string;
};

export default function SignupSuccess({
  message = "Your account has been created successfully!",
}: Props) {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="w-full max-w-md min-h-125 bg-white/30 backdrop-blur-md rounded-2xl p-10 shadow-lg text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow">
          <Image
            src={SuccessImage}
            alt="Success"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <h2
          className="mt-8 text-2xl font-bold text-gray-900"
          role="status"
          aria-live="polite"
        >
          Success 🎉
        </h2>

        <p className="mt-3 text-gray-700">
          {message}
        </p>

        <Link
          href="/redirect"
          className="mt-8 inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-8 rounded-full transition duration-200"
        >
          Continue
        </Link>
      </div>
    </main>
  );
}