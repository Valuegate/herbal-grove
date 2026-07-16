import { CheckCircle2, Clock3 } from "lucide-react";

interface Props {
  darkMode: boolean;
}

const uploads = [
  {
    id: 1,
    name: "Turmeric Research.pdf",
    status: "Indexed",
  },
  {
    id: 2,
    name: "Neem Study.pdf",
    status: "Processing",
  },
  {
    id: 3,
    name: "Ginger Guide.pdf",
    status: "Indexed",
  },
];

export default function Uploads({ darkMode }: Props) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <h2 className="text-lg font-semibold mb-6">
        Recent Uploads
      </h2>

      <div className="space-y-5">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="flex items-center justify-between"
          >
            <span>{upload.name}</span>

            <span
              className={`flex items-center gap-2 text-sm ${
                upload.status === "Indexed"
                  ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {upload.status === "Indexed" ? ( <CheckCircle2 size={18} /> ) : ( <Clock3 size={18} />)}
              {upload.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}