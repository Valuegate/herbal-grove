"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { GoogleIcon, FacebookIcon } from "../ui/icons";

type FormFields = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch, // Fixed: watch comes from useForm, NOT from 'fs'
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form Data:", data);
  };

  // Common input style
  const inputStyle =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-black text-sm";

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#1a7a1e] mb-2">Create Account</h2>
      <p className="text-gray-500 text-sm mb-6">
        Your journey to natural wellness starts here.
      </p>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-[#f5f5f5] hover:bg-gray-200 text-black py-2.5 rounded-lg text-xs font-semibold transition-colors border border-gray-200"
        >
          <GoogleIcon className="w-4 h-4" /> Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors"
        >
          <FacebookIcon className="w-4 h-4" /> Facebook
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-gray-400 text-xs uppercase">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Full Name</label>
          <input
            {...register("fullname", { required: "Full name is required" })}
            type="text"
            placeholder="John Doe"
            className={inputStyle}
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs">{errors.fullname.message}</p>
          )}
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
              type="password"
              placeholder="••••••••"
              className={inputStyle}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (val) =>
                  val === watch("password") || "Passwords don't match",
              })}
              type="password"
              placeholder="••••••••"
              className={inputStyle}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 py-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 w-4 h-4 accent-[#1a7a1e]"
          />
          <label
            htmlFor="terms"
            className="text-[10px] text-gray-500 leading-tight"
          >
            I agree to the{" "}
            <span className="text-[#1a7a1e] underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#1a7a1e] underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </label>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-[#1a7a1e] font-bold hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};
