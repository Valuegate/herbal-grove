"use client";

import { X, Save } from "lucide-react";
import { useState } from "react";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const DAY_LABELS: Record<number, string> = Object.fromEntries(DAYS.map((day) => [day.value, day.label]));

export interface DaySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Props {
  schedule: DaySchedule[];
  darkMode: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (schedule: DaySchedule[]) => void;
}

function DayRow({
  day,
  darkMode,
  mutedClass,
  inputClass,
  headingClass,
  onToggle,
  onTimeChange,
}: {
  day: DaySchedule;
  darkMode: boolean;
  mutedClass: string;
  inputClass: string;
  headingClass: string;
  onToggle: () => void;
  onTimeChange: (field: "startTime" | "endTime", value: string) => void;
}) {
  return (
    <div className={`rounded-xl border p-4 ${darkMode ? "border-neutral-700 bg-[#181818]" : "border-gray-200 bg-gray-50"}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 lg:w-40">
          <span className={`h-2.5 w-2.5 rounded-full ${day.isAvailable ? "bg-green-600" : "bg-gray-400"}`} />
          <span className={`font-bold ${headingClass}`}>{DAY_LABELS[day.dayOfWeek]}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              day.isAvailable
                ? "bg-green-100 text-green-700"
                : darkMode
                ? "bg-neutral-700 text-neutral-300"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {day.isAvailable ? "Available" : "Unavailable"}
          </button>

          {day.isAvailable && (
            <>
              <input
                type="time"
                value={day.startTime}
                onChange={(e) => onTimeChange("startTime", e.target.value)}
                className={inputClass}
              />
              <span className={mutedClass}>to</span>
              <input
                type="time"
                value={day.endTime}
                onChange={(e) => onTimeChange("endTime", e.target.value)}
                className={inputClass}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetAvailabilityModal({ schedule, darkMode, isSaving, onClose, onSave }: Props) {
  const [localSchedule, setLocalSchedule] = useState<DaySchedule[]>(schedule);

  const headingClass = darkMode ? "text-white" : "text-neutral-900";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const borderClass = darkMode ? "border-neutral-700" : "border-gray-200";
  const inputClass = `rounded-xl border px-4 py-3 outline-none focus:border-green-600 ${
    darkMode ? "border-neutral-700 bg-[#181818] text-white" : "border-gray-200 bg-white text-gray-900"
  }`;

  function updateDay(dayOfWeek: number, updates: Partial<DaySchedule>) {
    setLocalSchedule((current) =>
      current.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day))
    );
  }

  function handleSave() {
    for (const day of localSchedule) {
      if (day.isAvailable && day.endTime <= day.startTime) {
        alert(`End time must be after start time for ${DAY_LABELS[day.dayOfWeek]}.`);
        return;
      }
    }

    onSave(localSchedule);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl ${
          darkMode ? "bg-[#222224] text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b p-6 ${borderClass}`}>
          <div>
            <h2 className="text-xl font-bold">Set Available Days</h2>
            <p className={`mt-1 text-sm ${mutedClass}`}>Configure your weekly consultation schedule.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={`rounded-lg p-2 ${
              darkMode ? "text-neutral-400 hover:bg-neutral-800" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Days */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {localSchedule.map((day) => (
            <DayRow
              key={day.dayOfWeek}
              day={day}
              darkMode={darkMode}
              mutedClass={mutedClass}
              inputClass={inputClass}
              headingClass={headingClass}
              onToggle={() => updateDay(day.dayOfWeek, { isAvailable: !day.isAvailable })}
              onTimeChange={(field, value) => updateDay(day.dayOfWeek, { [field]: value })}
            />
          ))}
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 border-t p-6 ${borderClass}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={`rounded-xl px-5 py-3 text-sm font-semibold ${
              darkMode ? "bg-neutral-700 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}