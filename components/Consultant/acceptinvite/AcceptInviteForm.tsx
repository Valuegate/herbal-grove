"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { EyeIcon, EyeSlashIcon } from "@/components/ui/icons";

type FormFields = {
  fullname: string;
  password: string;
  confirmPassword: string;
};

const inputStyle =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-black text-sm";

function getInviteErrorMessage(error: any): string {
  const code = error?.code;
  switch (code) {
    case "form_password_pwned":
      return "That password has appeared in a data breach. Please choose another.";
    case "form_password_length_too_short":
      return "Password is too short.";
    case "verification_expired":
    case "form_ticket_invalid":
      return "This invitation link is invalid or has expired. Ask your admin to resend it.";
    default:
      return error?.longMessage || error?.message || "Unable to complete sign-up.";
  }
}

export const AcceptInviteForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, fetchStatus } = useSignUp();

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ticket = searchParams.get("__clerk_ticket");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  useEffect(() => {
    if (!ticket) {
      setApiError(
        "This invitation link is missing its token. Please use the link from your invitation email."
      );
    }
  }, [ticket]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (fetchStatus === "fetching" || !ticket) return;

    setApiError(null);

    const [firstName, ...rest] = data.fullname.trim().split(/\s+/);
    const lastName = rest.join(" ");

    // Ticket + password together requires the lower-level create() call —
    // signUp.ticket() alone doesn't accept a password parameter.
    const { error } = await signUp.create({
      strategy: "ticket",
      ticket,
      password: data.password,
      firstName,
      lastName,
    });

    if (error) {
      setApiError(getInviteErrorMessage(error));
      return;
    }

    if (signUp.status !== "complete") {
      setApiError("Sign-up didn't complete. Please try the invitation link again.");
      return;
    }

    const { error: finalizeError } = await signUp.finalize();

    if (finalizeError) {
      setApiError(getInviteErrorMessage(finalizeError));
      return;
    }

    router.push("/redirect");
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <h2 className="font-heading text-2xl font-bold text-[#1a7a1e] mb-2">
        Set Up Your Account
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        You've been invited to join as a consultant. Choose your name and password to finish.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

        <div className="space-y-1">
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
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === getValues("password") || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Clerk's CAPTCHA widget */}
        <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="en-us" />

        <button
          disabled={isSubmitting || fetchStatus === "fetching" || !ticket}
          type="submit"
          className="w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Setting Up Account..." : "Complete Sign Up"}
        </button>

        {apiError && <p className="text-center text-red-500 text-xs mt-2">{apiError}</p>}
      </form>
    </div>
  );
};