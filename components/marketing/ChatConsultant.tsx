"use client"

import Image from "next/image";
import Link from "next/link";
import { useUIStateContext } from "@/components/UIStateContext";
import { UserRound, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function ChatConsultant() {
  const { darkMode } = useUIStateContext();
  const consultants = useQuery(api.consultants.getAllConsultants);
  const { user } = useUser();
  const router = useRouter();
  const createConsultation = useMutation(api.consultations.createConsultation);

  if(!consultants) {
    return <p>Loading.....</p>
  }

  return (
    <section className="px-4">
      <div className={`mx-auto flex min-h-28.75 max-w-6xl flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition-colors ${darkMode ? "bg-[#222224] text-white" : "bg-white text-black"}`}>
        <div className={`mb-3 inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-[#f7f7f7] px-3 py-1 text-[10px] font-medium text-slate-800`}>
          <UserRound className="w-3.5 h-3.5" />
          Consultant
        </div>

        <h1 className={`text-2xl font-bold leading-tight sm:text-[28px] ${darkMode ? "text-white" : "text-black"}`}>
          Talk to a herbal expert
        </h1>

        <p className={`mt-1 max-w-md text-sm leading-5 ${darkMode ? "text-neutral-300" : "text-slate-500"}`}>
          Choose a verified consultant for educational guidance,
          <br className="hidden sm:block" />
          Not a medical service.
        </p>
      </div>

      {/*Available Consultants*/}
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between px-1">
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            {consultants.length} Consultants available
          </span>

          <Link
            href="#"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              darkMode ? "text-white" : "text-[#222224]"
            }`}
          >
            Sort By :
            <span
              className={`rounded-md px-3 py-2 text-xs font-bold ${
                darkMode ? "bg-[#2b2b2b] text-white" : "bg-white text-black"
              }`}
            >
              Recommended
            </span>
          </Link>
        </div>

        {/* Available Consultants */}
        <div className="space-y-4">
          {consultants.map((consultant) => (
            <div
              key={consultant._id}
              className={`
                flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 sm:gap-6 rounded-xl border px-5 py-7 transition-all duration-200
                ${
                  darkMode
                    ? "border-transparent bg-[#222224]"
                    : "border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-lg shadow-inner select-none">
                  <Image
                    src={consultant.imageUrl || "/default-avatar.png"}
                    alt={consultant.fullName}
                    width={50}
                    height={50}
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <h4
                      className={`text-base font-bold leading-tight ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {consultant.fullName}
                    </h4>

                    <p
                      className={`mt-1 text-sm ${
                        darkMode ? "text-neutral-300" : "text-neutral-700"
                      }`}
                    >
                      Clinical Herbal Consultant
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                        darkMode
                          ? "bg-[#2f2f31] text-neutral-300"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      Evidence Based
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                        darkMode
                          ? "bg-[#2f2f31] text-neutral-300"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      Stress and sleep
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs font-medium ${
                      darkMode ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">4.8/5</span>
                  </div>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    {consultant.description?.slice(0,80)}
                    <span className="font-semibold text-green-700">
                      * {consultant.isOnline ? "Online" : "Offline"}
                    </span>
                  </p>
                </div>
              </div>
              <button onClick={async () => {
                if (!user) return;

                const consultationId = await createConsultation({
                  userId: user.id,
                  userName: user.fullName ?? "Anonymous",
                  userEmail: user.primaryEmailAddress?.emailAddress ?? "",
                  consultantId: consultant._id,
                });

                router.push(`/consultantchat/${consultationId}`);
              }}
                className="w-full sm:w-auto rounded-full bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800 cursor-pointer"
              >
                Start Consult
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Consults History */}
      <div className="space-y-4 pt-14">
        <div className="flex items-center justify-between px-1">
          <span
            className={`text-xs font-medium uppercase tracking-wide ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Consultant Chat History
          </span>

          <Link
            href="#"
            className={`text-sm font-bold underline ${
              darkMode ? "text-white" : "text-green-700"
            }`}
          >
            View All
          </Link>
        </div>

        <div
          className={`
            overflow-hidden border transition-all duration-300
            ${
              darkMode
                ? "border-transparent bg-[#222224] divide-y divide-neutral-700"
                : "border-gray-200 bg-white divide-y divide-gray-200 shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
            }
          `}
        >
          {consultants.map((consultant) => (
            <div
              key={consultant._id}
              className={`flex items-center justify-between gap-4 px-5 py-5 transition-colors ${
                darkMode ? "hover:bg-[#2b2b2b]" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-base shadow-inner select-none">
                  <Image
                    src={consultant.imageUrl || "/default-avatar.png"}
                    alt={consultant.fullName}
                    width={50}
                    height={50}
                  />
                </div>

                <h4
                  className={`text-sm font-bold leading-snug ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {consultant.fullName}
                </h4>
              </div>

              <span
                className={`shrink-0 text-xs font-medium uppercase ${
                  darkMode ? "text-neutral-400" : "text-black"
                }`}
              >
                {consultant.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
