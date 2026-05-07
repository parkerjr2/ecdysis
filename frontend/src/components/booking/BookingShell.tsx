"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StepProgress } from "@/components/booking/StepProgress";
import { useBooking } from "@/components/booking/BookingProvider";
import { LocationStep } from "@/components/booking/steps/LocationStep";
import { ServiceStep } from "@/components/booking/steps/ServiceStep";
import { DateTimeStep } from "@/components/booking/steps/DateTimeStep";
import { DetailsStep } from "@/components/booking/steps/DetailsStep";
import { ConfirmStep } from "@/components/booking/steps/ConfirmStep";
import { ConfirmedStep } from "@/components/booking/steps/ConfirmedStep";
import type { BookingStep } from "@/lib/booking-types";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

function StubPanel({ title, prevStep }: { title: string; prevStep: BookingStep | null }) {
  const { dispatch } = useBooking();
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ fontWeight: 600, fontSize: "18px", color: "#1a1a1a", margin: 0 }}>
        {title}
      </h3>
      <p style={{ marginTop: "8px", color: "#6b7280", fontSize: "14px" }}>
        Coming up next.
      </p>
      {prevStep && (
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_STEP", step: prevStep })}
          style={{
            marginTop: "16px",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#1a1a1a",
            textDecoration: "underline",
            background: "transparent",
            border: 0,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

export function BookingShell() {
  const { state } = useBooking();

  return (
    <>
      <div aria-hidden className="h-[80px] w-full bg-ec-dark" />
      <motion.section
        initial={{ opacity: 0, y: 300 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: easeOut }}
        className="ecdy-booking w-full"
      >
        <StepProgress />

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: easeOut }}
        >
          {state.currentStep === "location" && <LocationStep />}
          {state.currentStep === "service" && <ServiceStep />}
          {state.currentStep === "datetime" && <DateTimeStep />}
          {state.currentStep === "details" && <DetailsStep />}
          {state.currentStep === "confirm" && <ConfirmStep />}
          {state.currentStep === "confirmed" && <ConfirmedStep />}
        </motion.div>
      </AnimatePresence>
      </motion.section>
    </>
  );
}
