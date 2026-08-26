import { MessageSquare } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  consultations: {
    _id: Id<"consultations">;
    status: "pending" | "active" | "completed";
    createdAt: number;
    initialMessage: string;
  }[];
  darkMode: boolean;
}

export default function ConsultationHistory({
  consultations,
  darkMode,
}: Props) {
  const completed = consultations.filter(
    (item) => item.status === "completed"
  );

  return (
    <section
      className={`rounded-2xl border ${
        darkMode
          ? "border-neutral-700 bg-[#222224]"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <MessageSquare
            size={19}
            className="text-green-700"
          />

          <h2
            className={`font-bold ${
              darkMode ? "text-white" : "text-neutral-900"
            }`}
          >
            Consultation History
          </h2>
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="p-10 text-center text-sm text-gray-500">
          No completed consultations yet.
        </div>
      ) : (
        completed.map((consultation) => (
          <div
            key={consultation._id}
            className="border-b p-6 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`font-semibold ${
                    darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Consultation
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(
                    consultation.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Completed
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {consultation.initialMessage}
            </p>
          </div>
        ))
      )}
    </section>
  );
}