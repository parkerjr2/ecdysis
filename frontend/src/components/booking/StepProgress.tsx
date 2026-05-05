"use client";

import { useBooking } from "@/components/booking/BookingProvider";
import type { BookingStep } from "@/lib/booking-types";

interface StepDef {
  id: BookingStep;
  label: string;
  shortLabel?: string;
}

const STEPS: StepDef[] = [
  { id: "location", label: "New or Existing Client", shortLabel: "Client" },
  { id: "service", label: "Service" },
  { id: "datetime", label: "Date & Time", shortLabel: "Time" },
  { id: "details", label: "Details" },
  { id: "confirm", label: "Confirm" },
];

export function StepProgress() {
  const { state } = useBooking();
  const activeIndex = STEPS.findIndex((s) => s.id === state.currentStep);

  return (
    <nav className="ecdy-booking__progress" aria-label="Booking steps">
      <ol>
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex;
          const isComplete = i < activeIndex;
          const cls =
            "ecdy-booking__step" +
            (isActive ? " is-active" : "") +
            (isComplete ? " is-completed" : "");
          return (
            <li
              key={step.id}
              className={cls}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel ?? step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
