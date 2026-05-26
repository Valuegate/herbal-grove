"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";

type FormFields = {
  email: string
};

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();


  const onSubmit: SubmitHandler<FormFields> = async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  //Common input Style
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-black text-sm";

  return (
    <div className="w-full h-full flex flex-col justify-center  p-10">
      <h2 className="text-2xl font-bold text-[#1a7a1e] mb-2">Reset Password</h2>
      <p className="text-gray-500 text-sm mb-6">
        Continue your journey to natural wellness and herbal knowledge.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="space-y-6">
          <label className="text-xs font-bold text-black-700 ">Email</label>
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

        <button
          disabled={isSubmitting}
          type="submit"
          className="mt-4 w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Reset Password"}
        </button>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-[#1a7a1e] hover:underline">
            Return to Login
          </Link>
        </div>
      </form>
    </div>
  )
}