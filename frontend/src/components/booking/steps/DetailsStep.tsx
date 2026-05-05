"use client";

import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import type { CustomerInfo, SavedCard } from "@/lib/booking-types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

// US phone format: (123) 456-7890
function formatPhone(value: string): string {
  const d = digitsOnly(value).slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

type FieldKey = keyof CustomerInfo;
type FieldErrors = Partial<Record<FieldKey, string>>;

function validate(info: CustomerInfo): FieldErrors {
  const errs: FieldErrors = {};
  if (!info.givenName.trim()) errs.givenName = "First name is required.";
  if (!info.familyName.trim()) errs.familyName = "Last name is required.";
  if (!info.email.trim()) errs.email = "Email is required.";
  else if (!EMAIL_REGEX.test(info.email.trim()))
    errs.email = "Enter a valid email address.";
  const digits = digitsOnly(info.phone);
  if (!info.phone.trim()) errs.phone = "Phone is required.";
  else if (digits.length !== 10) errs.phone = "Enter a 10-digit US phone number.";
  return errs;
}

export function DetailsStep() {
  const { state, dispatch } = useBooking();
  const [info, setInfo] = useState<CustomerInfo>(state.customerInfo);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    givenName: false,
    familyName: false,
    email: false,
    phone: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const emailLookupTimer = useRef<number | null>(null);

  // Re-validate whenever info changes (silent — only show errors on touched fields)
  useEffect(() => {
    setErrors(validate(info));
  }, [info]);

  const setField = (key: FieldKey, value: string) => {
    setInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: FieldKey) => {
    setTouched((t) => ({ ...t, [key]: true }));
    if (key === "email") scheduleEmailLookup();
  };

  // Debounced email lookup → /api/booking/customer-cards
  const scheduleEmailLookup = () => {
    if (emailLookupTimer.current) {
      window.clearTimeout(emailLookupTimer.current);
    }
    const email = info.email.trim();
    if (!email || !EMAIL_REGEX.test(email)) {
      // Clear any saved cards if email is invalid/cleared.
      if (state.savedCards.length > 0 || state.savedCustomerId) {
        dispatch({ type: "SET_SAVED_CARDS", customerId: "", cards: [] });
      }
      return;
    }
    emailLookupTimer.current = window.setTimeout(() => {
      fetch("/api/booking/customer-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) return;
          const customer: { id: string } | null = data.customer;
          const cards: SavedCard[] = data.cards ?? [];
          if (customer) {
            dispatch({
              type: "SET_SAVED_CARDS",
              customerId: customer.id,
              cards,
            });
          } else {
            dispatch({ type: "SET_SAVED_CARDS", customerId: "", cards: [] });
          }
        })
        .catch(() => {
          // Silent — Step 5 still works without saved cards.
        });
    }, 400);
  };

  const handleNext = () => {
    const v = validate(info);
    setErrors(v);
    setTouched({
      givenName: true,
      familyName: true,
      email: true,
      phone: true,
    });
    if (Object.keys(v).length > 0) return;
    dispatch({ type: "SET_CUSTOMER_INFO", info });
    dispatch({ type: "SET_MARKETING_CONSENT", value: state.marketingConsent });
    dispatch({ type: "SET_STEP", step: "confirm" });
  };

  const handleBack = () => {
    dispatch({ type: "SET_CUSTOMER_INFO", info });
    dispatch({ type: "SET_STEP", step: "datetime" });
  };

  const renderInput = (
    key: FieldKey,
    label: string,
    type: "text" | "email" | "tel",
    autoComplete?: string,
  ) => {
    const showError = touched[key] && errors[key];
    return (
      <div className="ecdy-booking__field">
        <label className="ecdy-booking__label">
          {label} *
          <input
            className={
              "ecdy-booking__input" + (showError ? " has-error" : "")
            }
            type={type}
            autoComplete={autoComplete}
            value={info[key]}
            onChange={(e) => {
              const v = e.target.value;
              if (key === "phone") setField(key, formatPhone(v));
              else setField(key, v);
            }}
            onBlur={() => handleBlur(key)}
            required
          />
        </label>
        {showError && (
          <div className="ecdy-booking__field-error">{errors[key]}</div>
        )}
      </div>
    );
  };

  return (
    <div className="ecdy-booking__panel ecdy-booking__details-step">
      <h2 className="ecdy-booking__panel-title">Your Details</h2>

      <div>
        <div className="ecdy-booking__name-row">
          {renderInput("givenName", "First Name", "text", "given-name")}
          {renderInput("familyName", "Last Name", "text", "family-name")}
        </div>
        {renderInput("email", "Email", "email", "email")}
        {renderInput("phone", "Phone", "tel", "tel")}
      </div>

      <div className="ecdy-booking__consent-section">
        <label className="ecdy-booking__consent-label">
          <input
            type="checkbox"
            className="ecdy-booking__consent-checkbox"
            checked={state.marketingConsent}
            onChange={(e) =>
              dispatch({
                type: "SET_MARKETING_CONSENT",
                value: e.target.checked,
              })
            }
          />
          Text me marketing and loyalty offers from Ecdysis Barbershop.
        </label>
        <p className="ecdy-booking__consent-disclosure">
          You consent to receive marketing texts, including Loyalty messages,
          coupons, and discounts, via the phone number you provided from this
          business. Text STOP to unsubscribe from texts from this business at any
          time, or HELP for more information. MSG and data rates may apply.
          Joining this program is not a condition of purchase. You certify that
          you are at least 18 years of age.
        </p>
      </div>

      <p className="ecdy-booking__sms-disclaimer">
        By providing your phone number you acknowledge you will receive
        occasional informational messages, including automated messages, on your
        mobile device from this merchant. Text STOP to opt out at any time, and
        text HELP to get HELP. Message and data rates may apply.
      </p>

      <div className="ecdy-booking__actions">
        <button
          type="button"
          className="ecdy-booking__btn ecdy-booking__btn--secondary"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="ecdy-booking__btn ecdy-booking__btn--primary"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
