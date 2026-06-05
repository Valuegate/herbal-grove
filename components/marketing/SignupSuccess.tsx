import Link from "next/link";
import Image from "next/image";
import bgImage from "@/components/signup/bg-signup.png";
import SuccessImage from "@/components/signup/ss.png"

type Props = {
  onContinue?: () => void;
  message?: string;
};
export const SignupSuccess = ({ onContinue, message ="Your account has been created successfully"}: Props) => {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="w-full max-w-md min-h-125 bg-white/30 backdrop-blur-md rounded-2xl p-10 shadow-lg text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center ">
          <Image
            src={SuccessImage}
            alt="Success"
            className="object-contain"
            width={300}
            height={100}
          />
        </div>

        <h2 className="mt-6 text-lg font-bold text-gray-900" role="status" aria-live="polite">
          {message}
        </h2>

        <Link href="/login"
            onClick={onContinue}
            className="mt-8 inline-block bg-emerald-700 text-white py-2 px-8 rounded-full shadow hover:bg-emerald-800"
          >
            Login Now
        </Link>
      </div>
    </main>
  );
};