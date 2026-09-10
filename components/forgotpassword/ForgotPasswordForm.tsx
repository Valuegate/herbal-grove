"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

type EmailFields = {
  email: string;
};

// Common input style, matching the rest of the auth forms.
const inputStyle =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-black text-sm";

function getResetErrorMessage(error: any): string {
  const code = error?.code;
  switch (code) {
    case "identifier_not_found":
    case "user_not_found":
      return "No account found for that email address.";
    case "form_code_incorrect":
      return "That code isn't right. Please check and try again.";
    case "verification_expired":
      return "That code has expired. Request a new one.";
    case "form_password_pwned":
      return "That password has appeared in a data breach. Please choose another.";
    case "form_password_length_too_short":
      return "Password is too short.";
    default:
      return error?.longMessage || error?.message || "Something went wrong.";
  }
}

export const ForgotPasswordForm = () => {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [apiError, setApiError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFields>();

  const isBusy = fetchStatus === "fetching";

  // Step 1: send a reset code to the user's email
  const onSendCode: SubmitHandler<EmailFields> = async (data) => {
    setApiError(null);

    const { error: createError } = await signIn.create({
      identifier: data.email,
    });

    if (createError) {
      setApiError(getResetErrorMessage(createError));
      return;
    }

    const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();

    if (sendCodeError) {
      setApiError(getResetErrorMessage(sendCodeError));
      return;
    }

    setCodeSent(true);
  };

  // Step 2: verify the code the user received by email
  const onVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });

    if (error) {
      setApiError(getResetErrorMessage(error));
    }
    // On success, signIn.status flips to "needs_new_password" and the
    // component re-renders into the step-3 form below.
  };

  // Step 3: submit the new password
  const onSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });

    if (error) {
      setApiError(getResetErrorMessage(error));
      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();

      if (finalizeError) {
        setApiError(getResetErrorMessage(finalizeError));
        return;
      }

      router.push("/redirect");
      return;
    }

    if (signIn.status === "needs_second_factor") {
      setApiError("Two-factor authentication is required but isn't supported on this page yet.");
      return;
    }

    setApiError("Password reset didn't complete. Please try again.");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center p-10">
      <h2 className="text-2xl font-bold text-[#1a7a1e] mb-2">Reset Password</h2>
      <p className="text-gray-500 text-sm mb-6">
        Continue your journey to natural wellness and herbal knowledge.
      </p>

      {/* Step 1: collect email, request a reset code */}
      {!codeSent && (
        <form onSubmit={handleSubmit(onSendCode)}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-black-700">Email</label>
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
            disabled={isBusy}
            type="submit"
            className="mt-4 w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isBusy ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      )}

      {/* Step 2: verify the code, shown once sent but before a new password is required */}
      {codeSent && signIn.status !== "needs_new_password" && (
        <form onSubmit={onVerifyCode}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-black-700">
              Enter the code sent to your email
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              inputMode="numeric"
              placeholder="123456"
              className={inputStyle}
            />
          </div>

          <button
            disabled={isBusy || !code}
            type="submit"
            className="mt-4 w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isBusy ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      {/* Step 3: set a new password */}
      {signIn.status === "needs_new_password" && (
        <form onSubmit={onSubmitNewPassword}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-black-700">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className={inputStyle}
            />
          </div>

          <button
            disabled={isBusy || password.length < 8}
            type="submit"
            className="mt-4 w-full bg-[#1a7a1e] hover:bg-[#155d17] text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isBusy ? "Saving..." : "Set New Password"}
          </button>
        </form>
      )}

      {apiError && <p className="text-center text-red-500 text-xs mt-4">{apiError}</p>}

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-[#1a7a1e] hover:underline">
          Return to Login
        </Link>
      </div>
    </div>
  );
};