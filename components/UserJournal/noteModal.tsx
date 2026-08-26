"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { X } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  note: {
    _id: Id<"careJournalNotes">;
    title: string;
    content: string;
  } | null;

  userId: string;
  darkMode: boolean;
  onClose: () => void;
}

export default function NoteModal({
  note,
  userId,
  darkMode,
  onClose,
}: Props) {
  const createNote = useMutation(api.careJournal.createNote);
  const updateNote = useMutation(api.careJournal.updateNote);

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);

      if (note) {
        await updateNote({
          noteId: note._id,
          userId,
          title,
          content,
        });
      } else {
        await createNote({
          userId,
          title,
          content,
        });
      }

      onClose();
    } finally {
      setSaving(false);
    }
  }

  const inputClass = `w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600 ${
    darkMode
      ? "border-neutral-700 bg-[#181818] text-white"
      : "border-gray-200 bg-white text-gray-900"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={`w-full max-w-lg rounded-2xl ${
          darkMode ? "bg-[#222224]" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-neutral-900"
            }`}
          >
            {note ? "Edit Note" : "Add Note"}
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className={inputClass}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={6}
            className={`${inputClass} resize-none`}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white"
            >
              {saving
                ? "Saving..."
                : note
                ? "Save Changes"
                : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}