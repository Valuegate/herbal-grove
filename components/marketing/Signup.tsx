import { BrandSection } from "@/components/signup/BrandSection";
import { SignUpForm } from "@/components/signup/SignUpForm";
import bgImage from "@/components/signup/bg-signup.png"

export const SignUp = () => {
  <main className="w-full h-full min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-40 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
    <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-[850px] lg:min-h-[580px] mx-auto p-4 lg:p-0"></div>
    
    {/* Left column — brand section */}
    <div className="relative lg:absolute lg:left-0 z-0 w-full lg:w-[450px] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden lg:h-[550px] bg-white/80 mb-6 lg:mb-0 lg:pr-8">
      <BrandSection />
    </div>

    {/*Right column — sign up form */}
    <div className="relative lg:absolute lg:right-0 z-10 w-full lg:w-[500px] rounded-[2rem] shadow-2xl overflow-hidden bg-[#FAFAFA] border border-gray-100 min-h-[580px]">
      <SignUpForm />
    </div>
  </main>
}