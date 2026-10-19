"use client";

import { useEffect } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useConsultationPresence(
  consultationId: Id<"consultations"> | undefined,
  enabled = true
) {
  const { isAuthenticated } = useConvexAuth();

  const heartbeat = useMutation(api.consultationPresence.heartbeat);

  const leave = useMutation(api.consultationPresence.leave);

  useEffect(() => {
    if (!isAuthenticated || !enabled || !consultationId) return;

    void heartbeat({ consultationId });

    const interval = window.setInterval(() => {
      void heartbeat({ consultationId });
    }, 30_000);

    return () => {
      window.clearInterval(interval);

      void leave({ consultationId });
    };
  }, [
    consultationId,
    enabled,
    isAuthenticated,
    heartbeat,
    leave,
  ]);
}