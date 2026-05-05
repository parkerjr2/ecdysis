export type BookingStep =
  | "location"
  | "service"
  | "datetime"
  | "details"
  | "confirm"
  | "confirmed";

export type ClientType = "new" | "existing";

export interface SquareLocation {
  id: string;
  name: string;
  address: string;
}

export interface ServiceVariation {
  id: string;
  name: string;
  duration_minutes: number;
  price_amount: number;
  price_currency: string;
  version: number;
  team_member_ids: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category_names: string[];
  present_at_all_locations: boolean;
  present_at_location_ids: string[];
  absent_at_location_ids: string[];
  variations: ServiceVariation[];
}

export interface TeamMember {
  id: string;
  display_name: string;
}

export interface CartItem {
  service: Service;
  variation: ServiceVariation;
  teamMember: TeamMember | null;
  locked?: boolean;
  personKey: "primary" | "guest";
}

export interface AppointmentSegment {
  service_variation_id: string;
  service_variation_version: number;
  team_member_id: string;
  duration_minutes: number;
}

export interface AvailabilitySlot {
  start_at: string;
  location_id: string;
  appointment_segments: AppointmentSegment[];
}

export interface CustomerInfo {
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
}

export interface SavedCard {
  id: string;
  last_4: string;
  card_brand: string;
  exp_month: number;
  exp_year: number;
}

export interface BookingState {
  currentStep: BookingStep;
  clientType: ClientType | null;
  selectedLocation: SquareLocation | null;
  cart: CartItem[];
  cartGuest: CartItem[] | null;
  guestName: string;
  selectedDate: string | null;
  selectedSlot: AvailabilitySlot | null;
  customerInfo: CustomerInfo;
  marketingConsent: boolean;
  policyAccepted: boolean;
  savedCustomerId: string | null;
  savedCards: SavedCard[];
  bookingResult: {
    bookingId: string;
    status: string;
    startAt: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export type BookingAction =
  | { type: "SET_STEP"; step: BookingStep }
  | { type: "SET_CLIENT_TYPE"; clientType: ClientType }
  | { type: "SET_LOCATION"; location: SquareLocation }
  | { type: "ADD_TO_CART"; item: CartItem }
  | { type: "REMOVE_FROM_CART"; variationId: string; personKey: "primary" | "guest" }
  | { type: "OPEN_GUEST_CART" }
  | { type: "REMOVE_GUEST" }
  | { type: "SET_GUEST_NAME"; name: string }
  | { type: "SET_SELECTED_DATE"; date: string }
  | { type: "SET_SELECTED_SLOT"; slot: AvailabilitySlot }
  | { type: "SET_CUSTOMER_INFO"; info: Partial<CustomerInfo> }
  | { type: "SET_MARKETING_CONSENT"; value: boolean }
  | { type: "SET_POLICY_ACCEPTED"; value: boolean }
  | { type: "SET_SAVED_CARDS"; customerId: string; cards: SavedCard[] }
  | { type: "SET_BOOKING_RESULT"; result: BookingState["bookingResult"] }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

export interface SquareErrorResponse {
  error: true;
  message: string;
  code: string;
}

export type SquareResult<T> = T | SquareErrorResponse;

export function isSquareError<T>(result: SquareResult<T>): result is SquareErrorResponse {
  return (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    (result as SquareErrorResponse).error === true
  );
}
