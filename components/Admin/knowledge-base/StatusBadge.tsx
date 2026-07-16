"use client";

interface Props {
  status: "Indexed" | "Processing" | "Failed";
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    Indexed: "bg-green-100 text-green-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}