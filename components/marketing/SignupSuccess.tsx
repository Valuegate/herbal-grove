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
      className="w-full min-h-screen flex items-center justify-center pt-20 p-4 md:p-8 lg:p-20 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-2xl p-10 shadow-lg text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-white  flex items-center justify-center ">
          <Image
            src={SuccessImage}
            alt="Success"
            className="w-24 h-24"
          />
        </div>

        <h2 className="mt-6 text-lg text-slate-800" role="status" aria-live="polite">
          {message}
        </h2>

        <Link href="/dashboard"
            onClick={onContinue}
            className="mt-8 inline-block bg-emerald-700 text-white py-2 px-8 rounded-full shadow hover:bg-emerald-800 transition"
          >
            Go to dashboard
        </Link>
      </div>
    </main>
  );
};