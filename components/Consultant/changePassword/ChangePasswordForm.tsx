"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@/components/ui/icons";

type FormFields = {
  password: string;
  confirmPassword: string;
};

export default function ChangePasswordForm() {
  const router = useRouter();

  const { user } = useUser();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormFields>();

  const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2b7a2d]";

  const onSubmit = async (data: FormFields) => {
  if (!user) return;

  try {
    setLoading(true);
    setError("");

    await user.updatePassword({
      newPassword: data.password,
    });

    await fetch("/api/consultant/password-changed", {
      method: "POST",
    });

    router.replace("/consultant/profile");
  } catch (err: any) {
    console.error(err);

    setError(
      err.errors?.[0]?.longMessage ??
        err.errors?.[0]?.message ??
        "Unable to change password."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-xl rounded-2xl bg-white p-8 shadow">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            New Password
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              className={inputStyle}
              {...register("password", {
                required:
                  "Password is required",
                minLength: {
                  value: 8,
                  message:
                    "Password must be at least 8 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-4"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              className={inputStyle}
              {...register(
                "confirmPassword",
                {
                  required:
                    "Please confirm your password",
                  validate: (value) =>
                    value ===
                      getValues("password") ||
                    "Passwords do not match",
                }
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-4"
            >
              {showConfirmPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#2b7a2d] py-3 font-semibold text-white transition hover:bg-[#246625] disabled:opacity-60"
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>
      </form>
    </div>
  );
}