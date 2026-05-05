"use client";

import { useBooking } from "@/components/booking/BookingProvider";

function formatDayLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mm = m.toString().padStart(2, "0");
  return `${h}:${mm} ${ampm}`;
}

export function ConfirmedStep() {
  const { state, dispatch } = useBooking();
  const result = state.bookingResult;
  const isPending = result?.status === "PENDING" || result?.status === "PENDING_APPROVAL";
  const heading = isPending ? "Booking Pending Approval" : "Booking Confirmed";

  return (
    <div className="ecdy-booking__panel">
      <div className="ecdy-booking__confirmed">
        <h2 className="ecdy-booking__confirmed-title">{heading}</h2>
        {result && (
          <p className="ecdy-booking__confirmed-summary">
            <strong>{formatDayLong(result.startAt)}</strong> at{" "}
            <strong>{formatTime(result.startAt)}</strong>
            <br />
            We&rsquo;ve sent a confirmation email to{" "}
            <strong>{state.customerInfo.email}</strong>.
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <button
            type="button"
            className="ecdy-booking__btn ecdy-booking__btn--primary"
            onClick={() => dispatch({ type: "RESET" })}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
