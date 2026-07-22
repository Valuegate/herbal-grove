"use client";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  const styles: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-700",

    approved:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",

    outdated:
      "bg-gray-200 text-gray-700",

    uploaded:
      "bg-blue-100 text-blue-700",

    processing:
      "bg-yellow-100 text-yellow-700",

    indexed:
      "bg-green-100 text-green-700",

    failed:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] ??
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}