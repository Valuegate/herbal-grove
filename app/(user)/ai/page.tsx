"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Camera } from "lucide-react";

export default function AIPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            AI Tools
          </h1>

          <p className="mt-2 text-gray-500">
            Explore HerbalMind's AI-powered tools.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <MessageCircle size={24} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              AI Chat
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Ask questions and get AI-powered guidance about herbs
              and wellness.
            </p>
          </button>

          <button
            type="button"
            onClick={() => router.push("/identify")}
            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Camera size={24} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Identify Herb
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Take or upload a photo and use AI to identify a
              herb or plant.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}