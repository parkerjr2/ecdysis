"use client";

import { useBooking } from "@/components/booking/BookingProvider";
import type { ClientType } from "@/lib/booking-types";

interface Choice {
  type: ClientType;
  label: string;
  desc: string;
}

const CHOICES: Choice[] = [
  { type: "new", label: "New Client", desc: "First time visiting us" },
  { type: "existing", label: "Existing Client", desc: "I've been here before" },
];

const BEFORE_YOU_BOOK = [
  "If this is your first visit to Ecdysis Barbershop, a free 15 minute consultation will be added to any haircut or styling service you book. A color consultation is required prior to booking any color service for new clients. This gives your barber necessary time to learn your hair. For technical hair types or styles, an additional fee may be applied after booking. For more information, please contact your barber.",
  "If you desire to cancel or reschedule, please be respectful of our time and give us a minimum of 12 hours notice. In the event of a no-call/no-show, the card on file will be charged and this is non-refundable.",
];

export function LocationStep() {
  const { state, dispatch } = useBooking();

  const handleSelect = (type: ClientType) => {
    dispatch({ type: "SET_CLIENT_TYPE", clientType: type });
    dispatch({ type: "SET_STEP", step: "service" });
  };

  return (
    <div className="ecdy-booking__panel">
      <div className="ecdy-byb">
        <div className="ecdy-byb__subtitle">What to Know</div>
        <div className="ecdy-byb__title">Before You Book</div>
        <div className="ecdy-byb__body">
          {BEFORE_YOU_BOOK.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="ecdy-booking__client-section">
        <h2 className="ecdy-booking__panel-title">
          Are you a new or existing client?
        </h2>

        {CHOICES.map((choice) => {
          const isSelected = state.clientType === choice.type;
          const cls =
            "ecdy-booking__card" + (isSelected ? " is-selected" : "");
          return (
            <button
              key={choice.type}
              type="button"
              onClick={() => handleSelect(choice.type)}
              className={cls}
              aria-pressed={isSelected}
            >
              <div className="ecdy-booking__card-title">{choice.label}</div>
              <div className="ecdy-booking__card-desc">{choice.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
