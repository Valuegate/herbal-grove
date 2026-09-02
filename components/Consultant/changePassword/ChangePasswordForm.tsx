"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm, type UseFormRegister, type FieldError } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@/components/ui/icons";

type FormFields = {
  password: string;
  confirmPassword: string;
};

const inputStyle = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2b7a2d]";

function PasswordField({
  label,
  register,
  name,
  rules,
  error,
}: {
  label: string;
  register: UseFormRegister<FormFields>;
  name: keyof FormFields;
  rules: Parameters<UseFormRegister<FormFields>>[1];
  error?: FieldError;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block font-medium">{label}</label>

      <div className="relative">
        <input type={visible ? "text" : "password"} className={inputStyle} {...register(name, rules)} />

        <button type="button" onClick={() => setVisible((v) => !v)} className="absolute right-4 top-4">
          {visible ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default function ChangePasswordForm() {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormFields>();

  async function onSubmit(data: FormFields) {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      await user.updatePassword({ newPassword: data.password });
      await fetch("/api/consultant/changepassword", { method: "POST" });

      router.replace("/consultant/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? "Unable to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl rounded-2xl bg-white p-8 shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <PasswordField
          label="New Password"
          register={register}
          name="password"
          rules={{
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          }}
          error={errors.password}
        />

        <PasswordField
          label="Confirm Password"
          register={register}
          name="confirmPassword"
          rules={{
            required: "Please confirm your password",
            validate: (value: string) => value === getValues("password") || "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        {error && <div className="rounded-lg bg-red-100 p-3 text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#2b7a2d] py-3 font-semibold text-white transition hover:bg-[#246625] disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}