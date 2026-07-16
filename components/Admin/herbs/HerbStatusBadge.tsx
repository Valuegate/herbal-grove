"use client";

interface Props {
  status: "verified" | "pending";
}

export default function HerbStatusBadge({ status }: Props) {
  const styles = {
    verified: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}