"use client";

import { useEffect, useMemo, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { useBookingConfig } from "@/components/booking/useBookingConfig";
import type { AvailabilitySlot } from "@/lib/booking-types";

const DOW_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 hr" : `${h} hr`;
  return `${h} hr ${m} min`;
}

type SlotGroupKey = "Morning" | "Afternoon" | "Evening";

function groupSlots(
  slots: AvailabilitySlot[],
): Record<SlotGroupKey, AvailabilitySlot[]> {
  const groups: Record<SlotGroupKey, AvailabilitySlot[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };
  for (const slot of slots) {
    const h = new Date(slot.start_at).getHours();
    if (h < 12) groups.Morning.push(slot);
    else if (h < 17) groups.Afternoon.push(slot);
    else groups.Evening.push(slot);
  }
  return groups;
}

export function DateTimeStep() {
  const { state, dispatch } = useBooking();
  const config = useBookingConfig();
  const locationId = config?.location_id ?? "";
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<string | null>(
    state.selectedDate,
  );
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const segments = useMemo(() => {
    return state.cart.map((item) => ({
      service_variation_id: item.variation.id,
      ...(item.teamMember ? { team_member_id: item.teamMember.id } : {}),
      service_variation_version: item.variation.version,
      duration_minutes: item.variation.duration_minutes,
    }));
  }, [state.cart]);

  // Fetch slots when a date is selected
  useEffect(() => {
    if (!selectedDate || segments.length === 0 || !locationId) {
      setSlots(null);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setError(null);
    fetch("/api/booking/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        location_id: locationId,
        segments,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setSlots(data.availability as AvailabilitySlot[]);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load slots");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, segments, locationId]);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    dispatch({ type: "SET_SELECTED_DATE", date });
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    dispatch({ type: "SET_SELECTED_SLOT", slot });
    dispatch({ type: "SET_STEP", step: "details" });
  };

  // Build calendar cells: empty cells for offset, then days
  const monthCells = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const offset = first.getDay(); // 0 (Sun) to 6 (Sat)
    const total = daysInMonth(viewMonth);
    const cells: Array<
      | { kind: "empty" }
      | { kind: "day"; date: Date; isoDate: string; disabled: boolean; today: boolean }
    > = [];
    for (let i = 0; i < offset; i++) cells.push({ kind: "empty" });
    for (let d = 1; d <= total; d++) {
      const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d);
      // Disabled if before today
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const disabled = dayStart < todayStart;
      cells.push({
        kind: "day",
        date,
        isoDate: ymd(date),
        disabled,
        today: sameDay(date, today),
      });
    }
    return cells;
  }, [viewMonth, today]);

  const grouped = slots ? groupSlots(slots) : null;
  const totalDuration = state.cart.reduce(
    (sum, c) => sum + c.variation.duration_minutes,
    0,
  );
  const isPrevDisabled = (() => {
    const start = startOfMonth(viewMonth);
    const monthStart = startOfMonth(today);
    return start <= monthStart;
  })();

  return (
    <div className="ecdy-booking__panel">
      <h2 className="ecdy-booking__panel-title">Pick a Date &amp; Time</h2>

      <div className="ecdy-booking__datetime-layout">
        <div className="ecdy-booking__datetime-main">
          <div className="ecdy-booking__calendar">
            <div className="ecdy-booking__calendar-header">
              <button
                type="button"
                className="ecdy-booking__calendar-nav"
                onClick={() =>
                  setViewMonth(
                    new Date(
                      viewMonth.getFullYear(),
                      viewMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                disabled={isPrevDisabled}
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className="ecdy-booking__calendar-title">
                {formatMonthYear(viewMonth)}
              </span>
              <button
                type="button"
                className="ecdy-booking__calendar-nav"
                onClick={() =>
                  setViewMonth(
                    new Date(
                      viewMonth.getFullYear(),
                      viewMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <div className="ecdy-booking__calendar-grid">
              {DOW_LABELS.map((d) => (
                <div key={d} className="ecdy-booking__calendar-dow">
                  {d}
                </div>
              ))}
              {monthCells.map((cell, i) => {
                if (cell.kind === "empty") {
                  return (
                    <div
                      key={`e${i}`}
                      className="ecdy-booking__calendar-day is-empty"
                    />
                  );
                }
                const cls =
                  "ecdy-booking__calendar-day" +
                  (cell.disabled ? " is-disabled" : "") +
                  (cell.today ? " is-today" : "") +
                  (selectedDate === cell.isoDate ? " is-selected" : "");
                return (
                  <button
                    key={cell.isoDate}
                    type="button"
                    className={cls}
                    data-date={cell.isoDate}
                    disabled={cell.disabled}
                    onClick={() => handleSelectDate(cell.isoDate)}
                  >
                    {cell.date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {!selectedDate && (
            <button
              type="button"
              className="ecdy-booking__btn--next-available"
              onClick={async () => {
                if (segments.length === 0 || !locationId) return;
                setError(null);
                try {
                  const resp = await fetch("/api/booking/next-availability", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      location_id: locationId,
                      segments,
                    }),
                  });
                  const data = await resp.json();
                  if (data.error) throw new Error(data.error);
                  const nextDate: string | null = data.next_date;
                  if (!nextDate) {
                    setError("No availability in the next 60 days.");
                    return;
                  }
                  // If the returned date is in a different month, navigate
                  // the calendar to it.
                  const [y, m] = nextDate.split("-").map(Number);
                  if (
                    y !== viewMonth.getFullYear() ||
                    m - 1 !== viewMonth.getMonth()
                  ) {
                    setViewMonth(new Date(y, m - 1, 1));
                  }
                  handleSelectDate(nextDate);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to find availability.",
                  );
                }
              }}
            >
              Go to next available →
            </button>
          )}

          {error && (
            <div
              className="ecdy-booking__error"
              role="alert"
              style={{ marginTop: 15 }}
            >
              {error}
            </div>
          )}

          {selectedDate && loadingSlots && (
            <div className="ecdy-booking__loading">Loading availability…</div>
          )}

          {selectedDate && grouped && !loadingSlots && (
            <div className="ecdy-booking__slots" id="ecdy-slots">
              {(["Morning", "Afternoon", "Evening"] as SlotGroupKey[]).map(
                (label) => (
                  <div key={label} className="ecdy-booking__slot-group">
                    <div className="ecdy-booking__slot-group-label">
                      {label}
                    </div>
                    {grouped[label].length === 0 ? (
                      <div className="ecdy-booking__slot-group-empty">
                        No availability
                      </div>
                    ) : (
                      <div className="ecdy-booking__slot-group-slots">
                        {grouped[label].map((slot) => {
                          const isSel =
                            state.selectedSlot?.start_at === slot.start_at;
                          return (
                            <button
                              key={slot.start_at}
                              type="button"
                              className={
                                "ecdy-booking__slot" +
                                (isSel ? " is-selected" : "")
                              }
                              onClick={() => handleSelectSlot(slot)}
                            >
                              {formatTime(slot.start_at)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <aside className="ecdy-booking__datetime-sidebar">
          <div className="ecdy-booking__appt-summary">
            <h3 className="ecdy-booking__appt-summary-title">
              Appointment summary
            </h3>
            {state.cart.map((item) => (
              <div
                key={item.variation.id}
                className="ecdy-booking__appt-summary-item"
              >
                <span className="ecdy-booking__appt-summary-name">
                  {item.service.name}
                </span>
                <span className="ecdy-booking__appt-summary-meta">
                  {item.teamMember
                    ? item.teamMember.display_name
                    : "Any available provider"}{" "}
                  · {formatDuration(item.variation.duration_minutes)}
                </span>
              </div>
            ))}
            {state.cart.length > 1 && (
              <div
                className="ecdy-booking__appt-summary-meta"
                style={{ marginTop: 6, fontWeight: 600 }}
              >
                Total: {formatDuration(totalDuration)}
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="ecdy-booking__actions">
        <button
          type="button"
          className="ecdy-booking__btn ecdy-booking__btn--secondary"
          onClick={() => dispatch({ type: "SET_STEP", step: "service" })}
        >
          Back
        </button>
      </div>
    </div>
  );
}
