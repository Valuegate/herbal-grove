"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import { useUIStateContext } from "@/components/UIStateContext";

import CertificateSection from "./CertificationSection";

type FormFields = {
  image: FileList;
  fullname: string;
  specialization: string;
  email: string;
  gender: string;
  bio: string;
};

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-500">{message}</p>;
}

export default function EditProfileForm() {
  const { darkMode } = useUIStateContext();
  const router = useRouter();
  const { user } = useUser();

  const [preview, setPreview] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );
  const saveConsultant = useMutation(api.consultants.saveConsultant);

  const fieldClass = `mt-2 w-full rounded-xl border px-4 py-3 outline-none ${
    darkMode ? "bg-[#252525] border-neutral-700" : "border-gray-300"
  }`;
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;
    setIsSaving(true);

    try {
      let imageUrl = consultant?.imageUrl;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Image upload failed.");

        imageUrl = result.url;
      }

      await saveConsultant({
        clerkId: user.id,
        fullName: data.fullname,
        specialization: data.specialization,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        gender: data.gender,
        bio: data.bio,
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
      fullname: user.fullName ?? "",
      specialization: consultant?.specialization ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      gender: consultant?.gender ?? "",
      bio: consultant?.bio ?? "",
    });

    if (consultant?.imageUrl) setPreview(consultant.imageUrl);
  }, [consultant, user, reset]);

  return (
    <div
      className={`rounded-3xl p-8 border transition ${
        darkMode ? "bg-[#1E1E1E] border-neutral-800" : "bg-white border-gray-200"
      }`}
    >
      <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-28 h-28 rounded-full overflow-hidden border-4 ${
              darkMode ? "border-neutral-700" : "border-gray-200"
            }`}
          >
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  darkMode ? "bg-neutral-800 text-neutral-500" : "bg-gray-100 text-gray-400"
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

              setSelectedImage(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Full Name</label>
            <input {...register("fullname")} className={fieldClass} />
            <ErrorText message={errors.fullname?.message} />
          </div>

          <div>
            <label className="font-medium">Email</label>
            <input
              disabled
              {...register("email")}
              className={`mt-2 w-full rounded-xl border px-4 py-3 cursor-not-allowed ${
                darkMode ? "bg-[#252525] border-neutral-700" : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="font-medium">Gender</label>
            <select {...register("gender")} className={fieldClass}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Professional Information</h2>
            <p className={`mt-1 ${mutedClass}`}>Information patients will see on your profile.</p>
          </div>

          <div>
            <label className="font-medium">Specialization</label>
            <input
              placeholder="e.g. Clinical Herbal Consultant"
              maxLength={60}
              {...register("specialization")}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="font-medium">Professional Bio</label>
            <textarea
              rows={6}
              maxLength={500}
              placeholder="Tell patients a little about yourself..."
              {...register("bio")}
              className={`${fieldClass} rounded-2xl resize-none`}
            />
          </div>
        </div>
      </form>

      <div className="mt-8">
        <CertificateSection />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          form="edit-profile-form"
          disabled={isSaving}
          className="bg-[#2b7a2d] hover:bg-[#236626] disabled:opacity-50 disabled:cursor-not-allowed transition text-white px-8 py-3 rounded-xl font-semibold"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}