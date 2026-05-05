"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useBooking } from "@/components/booking/BookingProvider";
import { useBookingConfig } from "@/components/booking/useBookingConfig";
import type { CartItem, TeamMember } from "@/lib/booking-types";

declare global {
  interface Window {
    Square?: {
      payments: (
        applicationId: string,
        locationId: string,
      ) => {
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
        }>;
      };
    };
  }
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
}

function formatPrice(amountCents: number, currency = "USD"): string {
  if (amountCents === 0) return "$0.00";
  return currency === "USD"
    ? `$${(amountCents / 100).toFixed(2)}`
    : `${currency} ${(amountCents / 100).toFixed(2)}`;
}

function formatDayLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
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

function endTime(iso: string, durationMinutes: number): string {
  const d = new Date(new Date(iso).getTime() + durationMinutes * 60_000);
  return formatTime(d.toISOString());
}

function cancelByLabel(iso: string): string {
  // 12 hours before the appointment
  const d = new Date(new Date(iso).getTime() - 12 * 60 * 60_000);
  const time = formatTime(d.toISOString());
  const day = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return `${time} on ${day}`;
}

function effectiveBarber(
  item: CartItem,
  assignedId: string | undefined,
  byId: Record<string, TeamMember>,
): TeamMember | null {
  if (item.teamMember) return item.teamMember;
  if (assignedId && byId[assignedId]) return byId[assignedId];
  return null;
}

function initials(name: string | null): string {
  const n = (name ?? "").trim();
  if (n.length >= 2) return n.slice(0, 2);
  if (n.length === 1) return n;
  return "AA";
}

function staffLabel(name: string | null): string {
  return name?.trim() || "Any available provider";
}

export function ConfirmStep() {
  const { state, dispatch } = useBooking();
  const config = useBookingConfig();
  const [cardInstance, setCardInstance] = useState<SquareCard | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(state.policyAccepted);
  const [policyError, setPolicyError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [useSavedCardId, setUseSavedCardId] = useState<string | null>(
    state.savedCards[0]?.id ?? null,
  );
  const [savedCardChosen, setSavedCardChosen] = useState(false);
  // When saved cards arrive after mount (lookup just resolved), auto-select
  // the first one — but never override an explicit user pick.
  useEffect(() => {
    if (savedCardChosen) return;
    if (useSavedCardId) return;
    if (state.savedCards.length > 0) {
      setUseSavedCardId(state.savedCards[0].id);
    }
  }, [state.savedCards, useSavedCardId, savedCardChosen]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Fetch team members (for resolving slot-assigned barber names)
  useEffect(() => {
    fetch("/api/booking/team-members")
      .then((r) => r.json())
      .then((d) => setTeamMembers(d.team_members ?? []))
      .catch(() => {});
  }, []);

  // Lookup saved cards on mount (matches plugin behavior — runs at Step 5
  // render). The Step-4 eager lookup may have missed if the user clicked
  // Next before the 400ms debounce fired, so re-run here whenever we don't
  // already have cards loaded.
  useEffect(() => {
    const email = state.customerInfo.email.trim();
    if (!email) return;
    if (state.savedCards.length > 0 || state.savedCustomerId) return;
    let cancelled = false;
    fetch("/api/booking/customer-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || data.error) return;
        const customer: { id: string } | null = data.customer;
        if (customer) {
          dispatch({
            type: "SET_SAVED_CARDS",
            customerId: customer.id,
            cards: data.cards ?? [],
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teamMembersById = useMemo(() => {
    const map: Record<string, TeamMember> = {};
    for (const m of teamMembers) map[m.id] = m;
    return map;
  }, [teamMembers]);

  // Mount Square Web Payments SDK card form once script + config are ready,
  // and only when there is no saved card we want to reuse.
  useEffect(() => {
    if (!scriptLoaded || !config || !cardContainerRef.current) return;
    if (useSavedCardId) return;
    if (!window.Square) return;
    let cancelled = false;
    let attached: SquareCard | null = null;
    (async () => {
      try {
        const payments = window.Square!.payments(
          config.application_id,
          config.location_id,
        );
        const card = await payments.card();
        if (cancelled) return;
        await card.attach("#ecdy-card-container");
        if (cancelled) return;
        attached = card;
        setCardInstance(card);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error
              ? `Square card form: ${err.message}`
              : "Failed to mount card form.",
          );
      }
    })();
    return () => {
      cancelled = true;
      // Best-effort cleanup; Square SDK doesn't expose a synchronous detach.
      if (attached && cardContainerRef.current) {
        cardContainerRef.current.innerHTML = "";
      }
    };
  }, [scriptLoaded, config, useSavedCardId]);

  const total = state.cart.reduce(
    (s, c) => s + c.variation.price_amount,
    0,
  );

  const slot = state.selectedSlot;
  const totalDuration = state.cart.reduce(
    (s, c) => s + c.variation.duration_minutes,
    0,
  );

  const segments = useMemo(() => {
    if (!slot) return [];
    // Use the team_member_id Square assigned in the slot's appointment_segments
    // (this is the highest-priority barber from the priority merge).
    return state.cart.map((item, i) => {
      const slotSeg = slot.appointment_segments[i];
      return {
        service_variation_id: item.variation.id,
        service_variation_version: item.variation.version,
        team_member_id:
          item.teamMember?.id ||
          slotSeg?.team_member_id ||
          "",
        duration_minutes: item.variation.duration_minutes,
      };
    });
  }, [state.cart, slot]);

  const canSubmit =
    policyAccepted &&
    !submitting &&
    !!slot &&
    state.cart.length > 0 &&
    (useSavedCardId !== null || cardInstance !== null);

  const handleBook = async () => {
    if (!slot) return;
    if (!policyAccepted) {
      setPolicyError(true);
      return;
    }
    setPolicyError(false);
    setError(null);
    setSubmitting(true);

    try {
      let cardNonce: string | undefined;
      if (!useSavedCardId && cardInstance) {
        const tokenResult = await cardInstance.tokenize();
        if (tokenResult.status !== "OK" || !tokenResult.token) {
          throw new Error(
            tokenResult.errors?.[0]?.message ??
              "Could not tokenize the card. Please check the details and try again.",
          );
        }
        cardNonce = tokenResult.token;
      }

      const payload: Record<string, unknown> = {
        location_id: config?.location_id ?? "",
        start_at: slot.start_at,
        segments,
        given_name: state.customerInfo.givenName,
        family_name: state.customerInfo.familyName,
        email: state.customerInfo.email,
        phone: state.customerInfo.phone,
      };
      if (state.savedCustomerId) {
        payload.saved_customer_id = state.savedCustomerId;
      }
      if (useSavedCardId) {
        payload.saved_card_id = useSavedCardId;
      } else if (cardNonce) {
        payload.card_nonce = cardNonce;
      }

      const resp = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        throw new Error(data.error ?? "Booking failed.");
      }
      dispatch({
        type: "SET_BOOKING_RESULT",
        result: {
          bookingId: data.booking.id,
          status: data.booking.status,
          startAt: data.booking.start_at,
        },
      });
      dispatch({ type: "SET_POLICY_ACCEPTED", value: true });
      dispatch({ type: "SET_STEP", step: "confirmed" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!slot) {
    return (
      <div className="ecdy-booking__panel">
        <h2 className="ecdy-booking__panel-title">Confirm Booking</h2>
        <div className="ecdy-booking__error">
          No time slot selected. Please go back and choose one.
        </div>
        <div className="ecdy-booking__actions">
          <button
            type="button"
            className="ecdy-booking__btn ecdy-booking__btn--secondary"
            onClick={() => dispatch({ type: "SET_STEP", step: "datetime" })}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ecdy-booking__panel">
      {config && (
        <Script
          key={config.environment}
          src={
            config.environment === "sandbox"
              ? "https://sandbox.web.squarecdn.com/v1/square.js"
              : "https://web.squarecdn.com/v1/square.js"
          }
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
          onReady={() => setScriptLoaded(true)}
        />
      )}
      <h2 className="ecdy-booking__panel-title">Confirm Booking</h2>

      {error && (
        <div className="ecdy-booking__error" role="alert">
          {error}
        </div>
      )}

      <div className="ecdy-booking__confirm-top-row">
        <div className="ecdy-booking__confirm-left">
          <div className="ecdy-booking__confirm-left-columns">
            {/* Contact info card */}
            <div className="ecdy-booking__confirm-card">
              <div className="ecdy-booking__confirm-customer-title">
                Contact information
              </div>
              <div className="ecdy-booking__confirm-customer-line">
                {state.customerInfo.givenName} {state.customerInfo.familyName}
              </div>
              <div className="ecdy-booking__confirm-customer-line">
                {state.customerInfo.email}
              </div>
              <div className="ecdy-booking__confirm-customer-line">
                {state.customerInfo.phone}
              </div>
            </div>

            {/* Cancellation policy card */}
            <div className="ecdy-booking__policy-section">
              <div className="ecdy-booking__policy-title">
                Cancellation policy
                <span className="ecdy-booking__required-flag">* Required</span>
              </div>
              <div className="ecdy-booking__cancel-by">
                Cancel before {cancelByLabel(slot.start_at)}
              </div>
              <p className="ecdy-booking__policy-text">
                Please cancel or reschedule at least 12 hours before your
                appointment. Late cancellations and no-shows may result in a
                charge to the card on file.
              </p>
              <label className="ecdy-booking__consent-label">
                <input
                  type="checkbox"
                  className="ecdy-booking__consent-checkbox"
                  checked={policyAccepted}
                  onChange={(e) => {
                    setPolicyAccepted(e.target.checked);
                    if (e.target.checked) setPolicyError(false);
                    dispatch({
                      type: "SET_POLICY_ACCEPTED",
                      value: e.target.checked,
                    });
                  }}
                />
                I have read and agreed to the cancellation policy of Ecdysis
                Barbershop.
              </label>
              {policyError && !policyAccepted && (
                <div className="ecdy-booking__policy-error">
                  Please accept the cancellation policy to continue.
                </div>
              )}
            </div>
          </div>

          {/* Card-on-file form */}
          <div className="ecdy-booking__card-form">
            <div className="ecdy-booking__card-form-title">
              Card on file
              <span className="ecdy-booking__required-flag">* Required</span>
            </div>
            <div className="ecdy-booking__card-hold-note">
              A card on file is required to book. Purchase will never be made
              without your approval. Protected and encrypted by Square.
            </div>

            {state.savedCards.length > 0 && (
              <div className="ecdy-booking__saved-cards">
                {state.savedCards.map((card) => (
                  <label
                    key={card.id}
                    className={
                      "ecdy-booking__saved-card-label" +
                      (useSavedCardId === card.id ? " is-selected" : "")
                    }
                  >
                    <input
                      type="radio"
                      name="saved-card"
                      checked={useSavedCardId === card.id}
                      onChange={() => {
                        setUseSavedCardId(card.id);
                        setSavedCardChosen(true);
                      }}
                    />
                    {card.card_brand} ending in {card.last_4} (exp{" "}
                    {String(card.exp_month).padStart(2, "0")}/{card.exp_year})
                  </label>
                ))}
                <label
                  className={
                    "ecdy-booking__saved-card-label" +
                    (useSavedCardId === null ? " is-selected" : "")
                  }
                >
                  <input
                    type="radio"
                    name="saved-card"
                    checked={useSavedCardId === null}
                    onChange={() => {
                      setUseSavedCardId(null);
                      setSavedCardChosen(true);
                    }}
                  />
                  Use a new card
                </label>
              </div>
            )}

            {!useSavedCardId && (
              <div ref={cardContainerRef} id="ecdy-card-container" />
            )}

            <p className="ecdy-booking__card-auth-note">
              Authorize Ecdysis Barbershop to save this card on file for future
              purchases until you cancel this authorization. Purchases will
              never be made without your approval. Saved cards can be managed
              by calling the shop directly.
            </p>
          </div>
        </div>

        {/* Right summary */}
        <div className="ecdy-booking__confirm-summary-col">
          <div className="ecdy-booking__confirm-sidebar-title">
            Appointment summary
          </div>
          <div className="ecdy-booking__confirm-card">
            <div className="ecdy-booking__confirm-datetime">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{formatDayLong(slot.start_at)}</span>
            </div>
            <div className="ecdy-booking__confirm-time">
              {formatTime(slot.start_at)} – {endTime(slot.start_at, totalDuration)}
            </div>
            <div className="ecdy-booking__confirm-est">
              Est. due at appointment: {formatPrice(total)}
            </div>
            <hr className="ecdy-booking__confirm-divider" />
            {state.cart.map((item, i) => {
              const assignedId =
                slot.appointment_segments[i]?.team_member_id ?? "";
              const barber = effectiveBarber(item, assignedId, teamMembersById);
              const name = barber?.display_name?.trim() ?? null;
              return (
                <div
                  key={item.variation.id}
                  className="ecdy-booking__confirm-service-item"
                >
                  <div className="ecdy-booking__confirm-initials">
                    {initials(name)}
                  </div>
                  <div className="ecdy-booking__confirm-details">
                    <div className="ecdy-booking__confirm-service-top">
                      <span className="ecdy-booking__confirm-service-name">
                        {item.service.name}
                      </span>
                      <span className="ecdy-booking__confirm-service-price">
                        {formatPrice(
                          item.variation.price_amount,
                          item.variation.price_currency,
                        )}
                      </span>
                    </div>
                    <div className="ecdy-booking__confirm-service-staff">
                      {formatTime(slot.start_at)} · with {staffLabel(name)}
                    </div>
                  </div>
                </div>
              );
            })}
            <hr className="ecdy-booking__confirm-divider" />
            <div className="ecdy-booking__confirm-totals">
              <div className="ecdy-booking__confirm-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="ecdy-booking__confirm-summary-row">
                <span>Taxes</span>
                <span>$0.00</span>
              </div>
              <div className="ecdy-booking__confirm-total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <hr className="ecdy-booking__confirm-divider" />
            <div className="ecdy-booking__confirm-totals">
              <div className="ecdy-booking__confirm-total-row">
                <span>Due today</span>
                <span>$0.00</span>
              </div>
              <div className="ecdy-booking__confirm-summary-row">
                <span>Due at appointment</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="ecdy-booking__btn ecdy-booking__btn--primary ecdy-booking__btn--full"
            onClick={handleBook}
            disabled={!canSubmit}
          >
            {submitting ? "Booking…" : "Book Appointment"}
          </button>
        </div>
      </div>

      <div className="ecdy-booking__actions">
        <button
          type="button"
          className="ecdy-booking__btn ecdy-booking__btn--secondary"
          onClick={() => dispatch({ type: "SET_STEP", step: "details" })}
        >
          Back
        </button>
      </div>
    </div>
  );
}
