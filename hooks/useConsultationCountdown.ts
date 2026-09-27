"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useConsultationCountdown({
  consultationId,
  endTime,
  isActive,
}: {
  consultationId: Id<"consultations"> | undefined;
  endTime: number | undefined;
  isActive: boolean;
}) {
  const [now, setNow] = useState(Date.now());

  const completeExpiredConsultation = useMutation(
    api.consultations.completeExpiredConsultation
  );

  useEffect(() => {
    if (!isActive || endTime === undefined) {
      return;
    }

    // Update immediately when the consultation becomes active.
    setNow(Date.now());

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isActive, endTime]);

  const remainingMs =
    endTime !== undefined
      ? Math.max(0, endTime - now)
      : 0;

  const remainingSeconds = Math.ceil(
    remainingMs / 1000
  );

  const showCountdown =
    isActive &&
    endTime !== undefined &&
    remainingMs > 0 &&
    remainingMs <= 5 * 60 * 1000;

  const hasEnded =
    isActive &&
    endTime !== undefined &&
    remainingMs === 0;

  useEffect(() => {
    if (!hasEnded || !consultationId) {
      return;
    }

    void completeExpiredConsultation({
      consultationId,
    });
  }, [
    hasEnded,
    consultationId,
    completeExpiredConsultation,
  ]);

  return {
    remainingSeconds,
    showCountdown,
    hasEnded,
  };
}