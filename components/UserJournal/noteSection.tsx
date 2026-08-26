"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import NoteModal from "./noteModal";

interface Note {
  _id: Id<"careJournalNotes">;
  title: string;
  content: string;
  updatedAt: number;
}

interface Props {
  notes: Note[];
  userId: string;
  darkMode: boolean;
}

export default function NotesSection({
  notes,
  userId,
  darkMode,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const deleteNote = useMutation(api.careJournal.deleteNote);

  const cardClass = `rounded-2xl border ${
    darkMode
      ? "border-neutral-700 bg-[#222224]"
      : "border-gray-200 bg-white shadow-sm"
  }`;

  const headingClass = darkMode
    ? "text-white"
    : "text-neutral-900";

  const mutedClass = darkMode
    ? "text-neutral-400"
    : "text-gray-500";

  async function handleDelete(noteId: Id<"careJournalNotes">) {
    if (!window.confirm("Delete this note?")) return;

    await deleteNote({
      noteId,
      userId,
    });
  }

  return (
    <>
      <section className={cardClass}>
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <div className="flex items-center gap-2">
              <FileText size={19} className="text-green-700" />

              <h2 className={`font-bold ${headingClass}`}>
                My Notes
              </h2>
            </div>

            <p className={`mt-1 text-sm ${mutedClass}`}>
              Personal notes for future consultations.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingNote(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            <Plus size={16} />
            Add Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="p-10 text-center">
            <p className={`text-sm ${mutedClass}`}>
              You haven't added any notes yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-neutral-700">
            {notes.map((note) => (
              <div
                key={note._id}
                className="flex items-start justify-between gap-4 p-6"
              >
                <div>
                  <h3 className={`font-semibold ${headingClass}`}>
                    {note.title}
                  </h3>

                  <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>
                    {note.content}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    Updated{" "}
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNote(note);
                      setShowModal(true);
                    }}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <NoteModal
          note={editingNote}
          userId={userId}
          darkMode={darkMode}
          onClose={() => {
            setShowModal(false);
            setEditingNote(null);
          }}
        />
      )}
    </>
  );
}