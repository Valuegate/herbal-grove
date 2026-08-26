"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { CalendarDays, Pencil } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";
import SetAvailabilityModal, {DaySchedule} from "./setAvailability";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function AvailabilityPage() {
  const { user } = useUser();
  const { darkMode } = useUIStateContext();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const availability = useQuery(
    api.consultantAvailability.getConsultantAvailability,
    consultant
      ? { consultantId: consultant._id }
      : "skip"
  );

  const saveWeeklyAvailability = useMutation(
    api.consultantAvailability.saveWeeklyAvailability
  );

  const [schedule, setSchedule] =
    useState<DaySchedule[]>([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    if (!availability) return;

    setSchedule(
      DAYS.map((day) => {
        const existing = availability.find(
          (item) =>
            item.dayOfWeek === day.value
        );

        return {
          dayOfWeek: day.value,
          startTime:
            existing?.startTime ?? "09:00",
          endTime:
            existing?.endTime ?? "17:00",
          isAvailable:
            existing?.isAvailable ?? false,
        };
      })
    );
  }, [availability]);

  async function handleSave(
    newSchedule: DaySchedule[]
  ) {
    if (!consultant) return;

    try {
      setIsSaving(true);

      await saveWeeklyAvailability({
        consultantId: consultant._id,
        schedule: newSchedule,
      });

      setSchedule(newSchedule);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save availability."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (
    consultant === undefined ||
    availability === undefined
  ) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="py-20 text-center">
        Consultant profile not found.
      </div>
    );
  }

  const headingClass = darkMode
    ? "text-white"
    : "text-neutral-900";

  const mutedClass = darkMode
    ? "text-neutral-400"
    : "text-gray-500";

  const cardClass = `rounded-2xl border ${
    darkMode
      ? "border-neutral-700 bg-[#222224]"
      : "border-gray-200 bg-white"
  }`;

  const hasAvailability = schedule.some(
    (day) => day.isAvailable
  );

  return (
    <>
      <main className="space-y-8">
        <div>
          <h1
            className={`text-3xl font-bold ${headingClass}`}
          >
            Availability
          </h1>

          <p className={`mt-2 ${mutedClass}`}>
            Manage your weekly consultation schedule.
          </p>
        </div>

        <section
          className={`${cardClass} overflow-hidden ${
            darkMode ? "" : "shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3">
                <CalendarDays
                  size={22}
                  className="text-green-700"
                />
              </div>

              <div>
                <h2
                  className={`font-bold ${headingClass}`}
                >
                  Weekly Schedule
                </h2>

                <p
                  className={`text-sm ${mutedClass}`}
                >
                  Your recurring consultation
                  availability.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
            >
              <Pencil size={16} />
              Set Available Days
            </button>
          </div>

          {!hasAvailability ? (
            <div className="p-10 text-center">
              <p className={mutedClass}>
                You haven't set your weekly
                availability yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-neutral-700">
              {schedule.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className="flex items-center justify-between px-6 py-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        day.isAvailable
                          ? "bg-green-600"
                          : "bg-gray-400"
                      }`}
                    />

                    <span
                      className={`font-semibold ${headingClass}`}
                    >
                      {
                        DAYS.find(
                          (item) =>
                            item.value ===
                            day.dayOfWeek
                        )?.label
                      }
                    </span>
                  </div>

                  {day.isAvailable ? (
                    <span
                      className={`text-sm ${mutedClass}`}
                    >
                      {formatTime(day.startTime)} –{" "}
                      {formatTime(day.endTime)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <SetAvailabilityModal
          schedule={schedule}
          darkMode={darkMode}
          isSaving={isSaving}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}