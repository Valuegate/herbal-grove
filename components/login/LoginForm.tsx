"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { GoogleIcon, FacebookIcon, EyeIcon, EyeSlashIcon } from "../ui/icons";
import Link from "next/link";

type FormFields = {
  email: string,
  password: string
}

export const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form Data:", data);
    // Redirect to dashboard after successful login
    router.push('/dashboard');
  };

  //Common input Style
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-black text-sm";

  //Password display states
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#1a7a1e] mb-2">Login Account</h2>
      <p className="text-gray-500 text-sm mb-6">
        Continue your journey to natural wellness and herbal knowledge.
      </p>

      {/* Social Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          className="flex flex-wrap items-center justify-center gap-2 bg-[#f5f5f5] hover:bg-gray-200 text-black py-2.5 rounded-lg text-xs font-semibold transition-colors border border-gray-200 whitespace-normal text-center"
        >
          <GoogleIcon className="w-4 h-4" /> Sign in with Google
        </button>
        <button
          type="button"
          className="flex flex-wrap items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-normal text-center"
        >
          <FacebookIcon className="w-4 h-4" /> Sign in with Facebook
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-gray-400 text-xs uppercase">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })}
            type="email"
            placeholder="john@example.com"
            className={inputStyle}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1 py-4">
          <label className="text-xs font-bold text-gray-700">Password</label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeIcon className="w-4 h-4" />
              ) : (
                <EyeSlashIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/*Password reset link*/}
          <p className="text-xs text-[#1a7a1e] mt-2 text-right">
            <Link href="/forgotpassword">
              Click to reset password?
            </Link>
          </p>

        <div className="flex items-center gap-2 py-4">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 accent-[#1a7a1e]"
          />
          <label htmlFor="remember" className="text-[10px] text-gray-500 leading-tight">Remember Me</label>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Login in to Account..." : "Login Account"}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#1a7a1e] font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
      
    </div>
  )
}