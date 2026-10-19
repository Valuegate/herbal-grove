"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import { useUIStateContext } from "@/components/UIStateContext";

type CertificateForm = {
  title: string;
  institution: string;
  awardedDate: string;
};

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CertificateForm) => Promise<void>;
  loading: boolean;
  initialValues?: CertificateForm;
}

export default function CertificateModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues,
}: CertificateModalProps) {
  const { darkMode } = useUIStateContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificateForm>();

  useEffect(() => {
    reset(
      initialValues ?? {
        title: "",
        institution: "",
        awardedDate: "",
      }
    );
  }, [initialValues, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-lg rounded-3xl shadow-xl ${
          darkMode ? "bg-neutral-900" : "bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b p-6 ${
            darkMode ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold">
            {initialValues
              ? "Edit Certificate"
              : "Add Certificate"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-6"
        >
          <div>
            <label className="font-medium">
              Certificate Title
            </label>

            <input
              {...register("title", {
                required: "Title is required",
              })}
              className={`mt-2 w-full rounded-xl border px-4 py-3 ${
                darkMode
                  ? "border-neutral-700 bg-neutral-800"
                  : "border-gray-300"
              }`}
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">
              Institution
            </label>

            <input
              {...register("institution", {
                required: "Institution is required",
              })}
              className={`mt-2 w-full rounded-xl border px-4 py-3 ${
                darkMode
                  ? "border-neutral-700 bg-neutral-800"
                  : "border-gray-300"
              }`}
            />

            {errors.institution && (
              <p className="mt-1 text-sm text-red-500">
                {errors.institution.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">
              Awarded Date
            </label>

            <input
              type="date"
              {...register("awardedDate", {
                required: "Awarded date is required",
              })}
              className={`mt-2 w-full rounded-xl border px-4 py-3 ${
                darkMode
                  ? "border-neutral-700 bg-neutral-800"
                  : "border-gray-300"
              }`}
            />

            {errors.awardedDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.awardedDate.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-[#2b7a2d] px-6 py-3 font-semibold text-white hover:bg-[#236626] disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialValues
                ? "Update"
                : "Add Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}