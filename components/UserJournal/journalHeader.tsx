import { BookOpen } from "lucide-react";

interface Props {
  darkMode: boolean;
}

export default function CareJournalHeader({ darkMode }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-green-100 p-3">
          <BookOpen size={24} className="text-green-700" />
        </div>

        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-neutral-900"
            }`}
          >
            My Care Journal
          </h1>

          <p
            className={`mt-1 ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            Keep track of your notes, documents, and consultation history.
          </p>
        </div>
      </div>
    </div>
  );
}