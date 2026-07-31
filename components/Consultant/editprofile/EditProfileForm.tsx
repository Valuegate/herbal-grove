"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import { useUIStateContext } from "@/components/UIStateContext";

type FormFields = {
  image: FileList;
  fullname: string;
  email: string;
  gender: string;
  description: string;
};

export default function EditProfileForm() {
  const { darkMode } = useUIStateContext();
  const router = useRouter();

  const [preview, setPreview] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? {clerkId: user.id} : "skip"
  );

  const saveConsultant = useMutation(api.consultants.saveConsultant);
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setIsSaving(true);

    try {
      if (!user) return;

      let imageUrl = consultant?.imageUrl;

      if (data.image?.length) {
        const formData = new FormData();

        formData.append("file", data.image[0]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        console.log("Status:", response.status);
        const result = await response.json();

        console.log("Upload result:", result);
        imageUrl = result.url;
        console.log("Image URL:", imageUrl);
      }

      await saveConsultant({
        clerkId: user.id,
        fullName: data.fullname,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        gender: data.gender,
        description: data.description,

        imageUrl,
      });

      router.push("/consultant/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    reset({
      fullname: consultant?.fullName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      gender: consultant?.gender ?? "",
      description: consultant?.description ?? "",
    });

    if (consultant?.imageUrl) {
      setPreview(consultant.imageUrl);
    }
  }, [consultant, user, reset]);

  return (
    <div
      className={`rounded-3xl p-8 border transition ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200"
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-28 h-28 rounded-full overflow-hidden border-4 ${
              darkMode
                ? "border-neutral-700"
                : "border-gray-200"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  darkMode
                    ? "bg-neutral-800 text-neutral-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                Photo
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setValue("image", e.target.files!);

              setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">
              Full Name
            </label>

            <input
              {...register("fullname", {
                required: "Full name is required",
              })}
              className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ${
                darkMode
                  ? "bg-[#252525] border-neutral-700"
                  : "border-gray-300"
              }`}
            />

            {errors.fullname && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullname.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">
              Email
            </label>

            <input
              disabled
              {...register("email")}
              className={`mt-2 w-full rounded-xl border px-4 py-3 cursor-not-allowed ${
                darkMode
                  ? "bg-[#252525] border-neutral-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="font-medium">
              Gender
            </label>

            <select
              {...register("gender")}
              className={`mt-2 w-full rounded-xl border px-4 py-3 ${
                darkMode
                  ? "bg-[#252525] border-neutral-700"
                  : "border-gray-300"
              }`}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-medium">
            Description
          </label>

          <textarea
            rows={6}
            maxLength={500}
            placeholder="Tell patients a little about yourself..."
            {...register("description")}
            className={`mt-2 w-full rounded-2xl border px-4 py-3 resize-none outline-none ${
              darkMode
                ? "bg-[#252525] border-neutral-700"
                : "border-gray-300"
            }`}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#2b7a2d] hover:bg-[#236626] disabled:opacity-50 disabled:cursor-not-allowed transition text-white px-8 py-3 rounded-xl font-semibold"
          >
            {isSaving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}