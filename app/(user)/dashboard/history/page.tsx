import { Suspense } from "react";
import ActivityHistory from "@/components/marketing/ActivityHistory";

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-slate-500">
          Loading history...
        </div>
      }
    >
      <ActivityHistory />
    </Suspense>
  );
}