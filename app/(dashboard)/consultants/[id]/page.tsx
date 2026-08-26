"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, CalendarDays, Clock3, CheckCircle2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  params: Promise<{ id: string }>;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ConsultantBookingPage({ params }: Props) {
  const { id } = use(params);

  const router = useRouter();
  const { user } = useUser();
  const { darkMode } = useUIStateContext();

  const consultantId = id as Id<"consultants">;

  const consultant = useQuery(api.consultants.getConsultantById, { consultantId });
  const bookingData = useQuery(api.availableSlots.getBookingAvailability, { consultantId });
  const userConsultations = useQuery(
    api.consultations.getUserConsultations,
    user ? { userId: user.id } : "skip"
  );
  const bookConsultation = useMutation(api.availableSlots.bookConsultation);

  const isFollowUpEligible = (userConsultations ?? []).some(
    (c) => c.consultantId === consultantId && c.status === "completed"
  );

  const [duration, setDuration] = useState(30);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [initialMessage, setInitialMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");

  const headingClass = darkMode ? "text-white" : "text-neutral-900";
  const mutedClass = darkMode ? "text-neutral-300" : "text-gray-600";
  const cardClass = `rounded-2xl border p-6 md:p-8 ${
    darkMode ? "border-neutral-700 bg-[#222224]" : "border-gray-200 bg-white shadow-sm"
  }`;

  // Generate bookable slots for the next 30 days from the consultant's
  // recurring weekly availability, sized to the selected duration and
  // excluding times that overlap an existing booking or have already passed.
  const upcomingDates = useMemo(() => {
    if (!bookingData) return [];

    const results: { dateKey: string; date: Date; times: number[] }[] = [];
    const now = new Date();
    const slotMs = duration * 60 * 1000;

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();
      const dayAvailability = bookingData.availability.find(
        (item) => item.dayOfWeek === dayOfWeek && item.isAvailable
      );

      if (!dayAvailability) continue;

      const [startHour, startMinute] = dayAvailability.startTime.split(":").map(Number);
      const [endHour, endMinute] = dayAvailability.endTime.split(":").map(Number);

      const dayStart = new Date(date);
      dayStart.setHours(startHour, startMinute, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(endHour, endMinute, 0, 0);

      const times: number[] = [];

      for (let time = dayStart.getTime(); time + slotMs <= dayEnd.getTime(); time += slotMs) {
        const slotEnd = time + slotMs;

        const isBooked = bookingData.bookedSlots.some(
          (slot) => slot.status === "booked" && time < slot.endTime && slotEnd > slot.startTime
        );

        if (!isBooked && time > Date.now()) {
          times.push(time);
        }
      }

      if (times.length > 0) {
        results.push({ dateKey: date.toISOString().split("T")[0], date, times });
      }
    }

    return results;
  }, [bookingData, duration]);

  if (consultant === undefined || bookingData === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className={darkMode ? "text-neutral-400" : "text-gray-500"}>Loading consultant...</p>
      </div>
    );
  }

  if (consultant === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className={`text-2xl font-bold ${headingClass}`}>Consultant not found</h1>
        <Link href="/consultants" className="mt-4 text-sm font-semibold text-green-700 hover:underline">
          Back to consultants
        </Link>
      </div>
    );
  }

  const selectedDate = upcomingDates.find((d) => d.times.includes(selectedTime ?? -1));
  const activeDateKey = selectedDateKey ?? upcomingDates[0]?.dateKey ?? null;
  const activeDate = upcomingDates.find((d) => d.dateKey === activeDateKey);

  function handleSelectDate(dateKey: string) {
    setSelectedDateKey(dateKey);
    setSelectedTime(null);
  }

  function handleSelectDuration(minutes: number) {
    setDuration(minutes);
    setSelectedDateKey(null);
    setSelectedTime(null);
  }

  async function handleBooking() {
    if (!consultant) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!selectedTime) {
      setError("Please select an available time.");
      return;
    }

    if (!initialMessage.trim()) {
      setError("Please tell the consultant what you'd like help with.");
      return;
    }

    try {
      setError("");
      setIsBooking(true);

      await bookConsultation({
        userId: user.id,
        userName: user.fullName ?? "Anonymous",
        userEmail: user.primaryEmailAddress?.emailAddress ?? "",
        consultantId: consultant._id,
        startTime: selectedTime,
        initialMessage: initialMessage.trim(),
        durationMinutes: duration,
      });

      router.push("/consultants");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unable to book this consultation.");
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 pb-12">
      {/* Back */}
      <Link
        href="/consultants"
        className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Consultants
      </Link>

      {/* Consultant Profile */}
      <section className={cardClass}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <Image
              src={consultant.imageUrl || "/default-avatar.png"}
              alt={consultant.fullName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl font-bold md:text-3xl ${headingClass}`}>{consultant.fullName}</h1>
              <CheckCircle2 size={20} className="text-green-600" />
            </div>

            <p className={`mt-1 ${mutedClass}`}>
              {consultant.specialization || "Herbal Wellness Consultant"}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className={consultant.isOnline ? "font-semibold text-green-600" : "text-gray-400"}>
                ● {consultant.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {consultant.bio && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className={`font-bold ${headingClass}`}>About the Consultant</h2>
            <p className={`mt-2 max-w-3xl text-sm leading-7 ${mutedClass}`}>{consultant.bio}</p>
          </div>
        )}
      </section>

      {/* Booking */}
      <section className={cardClass}>
        <div>
          <h2 className={`text-2xl font-bold ${headingClass}`}>Book a Consultation</h2>
          <p className={`mt-1 text-sm ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>
            Choose a convenient time and tell the consultant what you'd like help with.
          </p>
        </div>

        {upcomingDates.length === 0 ? (
          <div
            className={`mt-8 rounded-xl border p-8 text-center ${
              darkMode ? "border-neutral-700 bg-[#181818]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <CalendarDays className="mx-auto text-gray-400" size={32} />
            <h3 className={`mt-3 font-bold ${headingClass}`}>No available appointments</h3>
            <p className="mt-1 text-sm text-gray-500">
              This consultant hasn't opened any appointment slots yet.
            </p>
          </div>
        ) : (
          <>
            {isFollowUpEligible && (
              <div className="mt-8 space-y-3">
                <h3 className={`font-bold ${headingClass}`}>Session length</h3>
                <div className="flex gap-3">
                  {[30, 45, 60].map((minutes) => {
                    const active = duration === minutes;

                    return (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => handleSelectDuration(minutes)}
                        className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                          active
                            ? "border-green-700 bg-green-700 text-white"
                            : darkMode
                            ? "border-neutral-700 bg-[#181818] text-neutral-200 hover:border-green-600"
                            : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
                        }`}
                      >
                        {minutes} min
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Dates */}
            <div className="mt-8 space-y-4">
              <h3 className={`flex items-center gap-2 font-bold ${headingClass}`}>
                <CalendarDays size={19} className="text-green-700" />
                Choose a date
              </h3>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {upcomingDates.map(({ dateKey, date }) => {
                  const active = activeDateKey === dateKey;

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => handleSelectDate(dateKey)}
                      className={`shrink-0 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                        active
                          ? "border-green-700 bg-green-700 text-white"
                          : darkMode
                          ? "border-neutral-700 bg-[#181818] text-neutral-200 hover:border-green-600"
                          : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
                      }`}
                    >
                      <div className="text-xs uppercase opacity-80">
                        {date.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div>{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Times for the selected date */}
            {activeDate && (
              <div className="mt-6 space-y-3">
                <h3 className={`flex items-center gap-2 font-bold ${headingClass}`}>
                  <Clock3 size={19} className="text-green-700" />
                  Choose a time —{" "}
                  {activeDate.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {activeDate.times.map((time) => {
                    const selected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          selected
                            ? "border-green-700 bg-green-700 text-white"
                            : darkMode
                            ? "border-neutral-700 bg-[#181818] text-neutral-200 hover:border-green-600"
                            : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Initial Message */}
            <div className="mt-10">
              <label htmlFor="initialMessage" className={`mb-2 block text-sm font-bold ${headingClass}`}>
                What would you like help with?
              </label>

              <p className="mb-3 text-xs text-gray-500">
                Give the consultant a brief description of what you'd like to discuss.
              </p>

              <textarea
                id="initialMessage"
                value={initialMessage}
                onChange={(event) => setInitialMessage(event.target.value)}
                placeholder="For example: I've been having difficulty sleeping and would like to discuss herbal options that may support better sleep."
                rows={5}
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-green-600 ${
                  darkMode
                    ? "border-neutral-700 bg-[#181818] text-white placeholder:text-neutral-600"
                    : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
            )}

            {selectedTime && selectedDate && (
              <div
                className={`mt-6 rounded-xl border p-4 ${
                  darkMode ? "border-green-900 bg-green-950/20" : "border-green-100 bg-green-50"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">Selected Appointment</p>
                <p className={`mt-1 font-bold ${headingClass}`}>
                  {selectedDate.date.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={`mt-1 text-sm ${mutedClass}`}>
                  {formatTime(selectedTime)} – {formatTime(selectedTime + duration * 60 * 1000)}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleBooking}
              disabled={isBooking || !selectedTime || !initialMessage.trim()}
              className="mt-6 w-full rounded-xl bg-green-700 px-6 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBooking ? "Booking Consultation..." : "Book A Consultation"}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Your request will be sent to the consultant for confirmation.
            </p>
          </>
        )}
      </section>
    </main>
  );
}