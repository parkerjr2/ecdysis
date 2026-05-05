"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { BookingAction, BookingState } from "@/lib/booking-types";

const initialState: BookingState = {
  currentStep: "location",
  clientType: null,
  selectedLocation: null,
  cart: [],
  cartGuest: null,
  guestName: "",
  selectedDate: null,
  selectedSlot: null,
  customerInfo: { givenName: "", familyName: "", email: "", phone: "" },
  marketingConsent: false,
  policyAccepted: false,
  savedCustomerId: null,
  savedCards: [],
  bookingResult: null,
  isLoading: false,
  error: null,
};

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "SET_CLIENT_TYPE":
      // Selecting a client type clears the cart (matches plugin behavior).
      return {
        ...state,
        clientType: action.clientType,
        cart: [],
        cartGuest: null,
        guestName: "",
      };
    case "SET_LOCATION":
      return { ...state, selectedLocation: action.location };
    case "ADD_TO_CART": {
      const targetKey = action.item.personKey;
      if (targetKey === "guest") {
        const existing = state.cartGuest ?? [];
        return { ...state, cartGuest: [...existing, action.item] };
      }
      return { ...state, cart: [...state.cart, action.item] };
    }
    case "REMOVE_FROM_CART": {
      if (action.personKey === "guest") {
        const filtered = (state.cartGuest ?? []).filter(
          (i) => i.variation.id !== action.variationId,
        );
        return { ...state, cartGuest: filtered.length === 0 ? null : filtered };
      }
      return {
        ...state,
        cart: state.cart.filter((i) => i.variation.id !== action.variationId),
      };
    }
    case "OPEN_GUEST_CART":
      return { ...state, cartGuest: state.cartGuest ?? [] };
    case "REMOVE_GUEST":
      return { ...state, cartGuest: null, guestName: "" };
    case "SET_GUEST_NAME":
      return { ...state, guestName: action.name };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.date, selectedSlot: null };
    case "SET_SELECTED_SLOT":
      return { ...state, selectedSlot: action.slot };
    case "SET_CUSTOMER_INFO":
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.info },
      };
    case "SET_MARKETING_CONSENT":
      return { ...state, marketingConsent: action.value };
    case "SET_POLICY_ACCEPTED":
      return { ...state, policyAccepted: action.value };
    case "SET_SAVED_CARDS":
      return {
        ...state,
        savedCustomerId: action.customerId,
        savedCards: action.cards,
      };
    case "SET_BOOKING_RESULT":
      return { ...state, bookingResult: action.result };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return initialState;
  }
}

interface BookingContextValue {
  state: BookingState;
  dispatch: Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return ctx;
}
