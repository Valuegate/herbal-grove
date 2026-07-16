import { FilePlus2, Leaf } from "lucide-react";

interface Props {
  darkMode: boolean;
}

export default function QuickActions({ darkMode }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <button
        className={`rounded-2xl p-6 text-left transition hover:scale-[1.02] ${
          darkMode
            ? "bg-[#1E1E1E]"
            : "bg-white shadow-sm"
        }`}
      >
        <FilePlus2 className="mb-4 text-[#2B7A2D]" />

        <h3 className="font-semibold text-lg">
          Upload Document
        </h3>

        <p className="text-sm mt-2 text-gray-500">
          Upload a new research paper to the knowledge base.
        </p>
      </button>

      <button
        className={`rounded-2xl p-6 text-left transition hover:scale-[1.02] ${
          darkMode
            ? "bg-[#1E1E1E]"
            : "bg-white shadow-sm"
        }`}
      >
        <Leaf className="mb-4 text-[#2B7A2D]" />

        <h3 className="font-semibold text-lg">
          Add Herb
        </h3>

        <p className="text-sm mt-2 text-gray-500">
          Create a new herb entry for the knowledge base.
        </p>
      </button>
    </div>
  );
}