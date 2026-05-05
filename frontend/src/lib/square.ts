import type {
  SavedCard,
  Service,
  ServiceVariation,
  SquareErrorResponse,
  SquareLocation,
  SquareResult,
  TeamMember,
} from "@/lib/booking-types";
import { isSquareError } from "@/lib/booking-types";

const SQUARE_VERSION = "2025-01-23";

interface SquareApiError {
  errors?: Array<{ detail?: string; code?: string }>;
}

function getBaseUrl(): string {
  const env = process.env.SQUARE_ENVIRONMENT ?? "sandbox";
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

function getAccessToken(): string | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  return token && token.length > 0 ? token : null;
}

async function request<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: Record<string, unknown>,
): Promise<SquareResult<T>> {
  const token = getAccessToken();
  if (!token) {
    return { error: true, message: "No Square access token configured.", code: "NO_TOKEN" };
  }

  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(getBaseUrl() + endpoint, init);
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Network error",
      code: "NETWORK_ERROR",
    };
  }

  let data: unknown = null;
  const text = await response.text();
  if (text.length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const apiError = data as SquareApiError | null;
    const detail = apiError?.errors?.[0]?.detail ?? "Square API error";
    const code = apiError?.errors?.[0]?.code ?? "UNKNOWN";
    return { error: true, message: detail, code };
  }

  return (data ?? {}) as T;
}

interface RawLocation {
  id: string;
  name?: string;
  status?: string;
  address?: {
    address_line_1?: string;
    locality?: string;
    administrative_district_level_1?: string;
    postal_code?: string;
  };
}

export async function getLocations(): Promise<SquareResult<SquareLocation[]>> {
  const response = await request<{ locations?: RawLocation[] }>("GET", "/v2/locations");
  if ((response as SquareErrorResponse).error) {
    return response as SquareErrorResponse;
  }

  const raw = (response as { locations?: RawLocation[] }).locations ?? [];
  const locations: SquareLocation[] = raw
    .filter((loc) => loc.status === "ACTIVE")
    .map((loc) => {
      const a = loc.address ?? {};
      const address = [
        a.address_line_1,
        a.locality,
        a.administrative_district_level_1,
        a.postal_code,
      ]
        .filter((x): x is string => Boolean(x))
        .join(", ");
      return {
        id: loc.id,
        name: loc.name ?? "",
        address,
      };
    });

  return locations;
}

// ── Catalog (services) ──────────────────────────────────────────────────────

interface RawCatalogVariation {
  id: string;
  version?: number;
  item_variation_data?: {
    name?: string;
    service_duration?: number; // milliseconds
    price_money?: { amount?: number; currency?: string };
    team_member_ids?: string[];
  };
}

interface RawCatalogItem {
  type?: string;
  id: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[];
  absent_at_location_ids?: string[];
  item_data?: {
    name?: string;
    description?: string;
    product_type?: string;
    categories?: Array<{ id?: string }>;
    variations?: RawCatalogVariation[];
  };
}

interface RawCategory {
  type?: string;
  id: string;
  category_data?: { name?: string };
}

function parseVariations(raw: RawCatalogVariation[] | undefined): ServiceVariation[] {
  if (!raw) return [];
  const out: ServiceVariation[] = [];
  for (const v of raw) {
    const data = v.item_variation_data ?? {};
    const durMs = data.service_duration ?? 0;
    const duration = Math.floor(durMs / 60000);
    if (duration <= 0) continue;
    const price = data.price_money ?? {};
    out.push({
      id: v.id,
      name: data.name ?? "",
      duration_minutes: duration,
      price_amount: price.amount ?? 0,
      price_currency: price.currency ?? "USD",
      version: v.version ?? 0,
      team_member_ids: data.team_member_ids ?? [],
    });
  }
  return out;
}

function parseServiceItems(
  objects: RawCatalogItem[],
  categoryMap: Record<string, string>,
): Service[] {
  const services: Service[] = [];
  for (const item of objects) {
    if (item.type !== "ITEM") continue;
    const data = item.item_data ?? {};
    const variations = parseVariations(data.variations);
    if (variations.length === 0) continue;
    const categoryNames: string[] = [];
    for (const cat of data.categories ?? []) {
      if (cat.id && categoryMap[cat.id]) categoryNames.push(categoryMap[cat.id]);
    }
    services.push({
      id: item.id,
      name: data.name ?? "",
      description: data.description ?? "",
      category_names: categoryNames,
      present_at_all_locations: Boolean(item.present_at_all_locations),
      present_at_location_ids: item.present_at_location_ids ?? [],
      absent_at_location_ids: item.absent_at_location_ids ?? [],
      variations,
    });
  }
  return services;
}

async function getCategoryMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  let cursor: string | undefined;
  do {
    const endpoint =
      "/v2/catalog/list?types=CATEGORY" +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const resp = await request<{ objects?: RawCategory[]; cursor?: string }>(
      "GET",
      endpoint,
    );
    if ((resp as SquareErrorResponse).error) break;
    const r = resp as { objects?: RawCategory[]; cursor?: string };
    for (const obj of r.objects ?? []) {
      if (obj.id && obj.category_data?.name) {
        map[obj.id] = obj.category_data.name;
      }
    }
    cursor = r.cursor;
  } while (cursor);
  return map;
}

export async function getServices(): Promise<SquareResult<Service[]>> {
  // Try the dedicated search first.
  const searchResp = await request<{
    objects?: RawCatalogItem[];
    related_objects?: RawCatalogItem[];
  }>("POST", "/v2/catalog/search", {
    object_types: ["ITEM"],
    query: {
      exact_query: {
        attribute_name: "product_type",
        attribute_value: "APPOINTMENTS_SERVICE",
      },
    },
    include_related_objects: true,
  });

  if (!(searchResp as SquareErrorResponse).error) {
    const r = searchResp as {
      objects?: RawCatalogItem[];
    };
    if (r.objects && r.objects.length > 0) {
      const categoryMap = await getCategoryMap();
      const services = parseServiceItems(r.objects, categoryMap);
      if (services.length > 0) return services;
    }
  }

  // Fallback: list catalog items, filter by product_type/service_duration.
  const services: Service[] = [];
  let cursor: string | undefined;
  const categoryMap = await getCategoryMap();
  do {
    const endpoint =
      "/v2/catalog/list?types=ITEM" +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const resp = await request<{ objects?: RawCatalogItem[]; cursor?: string }>(
      "GET",
      endpoint,
    );
    if ((resp as SquareErrorResponse).error) {
      return resp as SquareErrorResponse;
    }
    const r = resp as { objects?: RawCatalogItem[]; cursor?: string };
    for (const item of r.objects ?? []) {
      const data = item.item_data ?? {};
      const productType = data.product_type ?? "";
      let hasServiceDuration = false;
      for (const v of data.variations ?? []) {
        if ((v.item_variation_data?.service_duration ?? 0) > 0) {
          hasServiceDuration = true;
          break;
        }
      }
      if (productType !== "APPOINTMENTS_SERVICE" && !hasServiceDuration) continue;
      const variations = parseVariations(data.variations);
      if (variations.length === 0) continue;
      const categoryNames: string[] = [];
      for (const cat of data.categories ?? []) {
        if (cat.id && categoryMap[cat.id])
          categoryNames.push(categoryMap[cat.id]);
      }
      services.push({
        id: item.id,
        name: data.name ?? "",
        description: data.description ?? "",
        category_names: categoryNames,
        present_at_all_locations: Boolean(item.present_at_all_locations),
        present_at_location_ids: item.present_at_location_ids ?? [],
        absent_at_location_ids: item.absent_at_location_ids ?? [],
        variations,
      });
    }
    cursor = r.cursor;
  } while (cursor);

  return services;
}

// ── Team members ────────────────────────────────────────────────────────────

interface RawTeamMemberProfile {
  team_member_id: string;
  display_name?: string;
}

// ── Availability ────────────────────────────────────────────────────────────

export interface AvailabilitySegmentInput {
  service_variation_id: string;
  team_member_id?: string;
  service_variation_version?: number;
  duration_minutes?: number;
}

interface RawAppointmentSegment {
  team_member_id?: string;
  service_variation_id?: string;
  duration_minutes?: number;
  service_variation_version?: number;
}

interface RawAvailability {
  start_at?: string;
  location_id?: string;
  appointment_segments?: RawAppointmentSegment[];
}

export interface AvailabilitySlotResult {
  start_at: string;
  location_id: string;
  appointment_segments: Array<{
    service_variation_id: string;
    team_member_id: string;
    duration_minutes: number;
    service_variation_version: number;
  }>;
}

function buildSegmentFilters(
  segments: AvailabilitySegmentInput[],
): Array<Record<string, unknown>> {
  return segments.map((seg) => {
    const sf: Record<string, unknown> = {
      service_variation_id: seg.service_variation_id,
    };
    if (seg.team_member_id) {
      sf.team_member_id_filter = { any: [seg.team_member_id] };
    }
    return sf;
  });
}

function normalizeAvailability(
  raw: RawAvailability[],
): AvailabilitySlotResult[] {
  return raw.map((a) => ({
    start_at: a.start_at ?? "",
    location_id: a.location_id ?? "",
    appointment_segments: (a.appointment_segments ?? []).map((s) => ({
      service_variation_id: s.service_variation_id ?? "",
      team_member_id: s.team_member_id ?? "",
      duration_minutes: s.duration_minutes ?? 0,
      service_variation_version: s.service_variation_version ?? 0,
    })),
  }));
}

export async function searchAvailability(
  date: string,
  locationId: string,
  segments: AvailabilitySegmentInput[],
): Promise<SquareResult<AvailabilitySlotResult[]>> {
  const startAt = `${date}T00:00:00Z`;
  const endAt = `${date}T23:59:59Z`;
  const body = {
    query: {
      filter: {
        start_at_range: { start_at: startAt, end_at: endAt },
        location_id: locationId,
        segment_filters: buildSegmentFilters(segments),
      },
    },
  };
  const resp = await request<{ availabilities?: RawAvailability[] }>(
    "POST",
    "/v2/bookings/availability/search",
    body,
  );
  if ((resp as SquareErrorResponse).error) return resp as SquareErrorResponse;
  const r = resp as { availabilities?: RawAvailability[] };
  return normalizeAvailability(r.availabilities ?? []);
}

/**
 * Search availability per provider in priority order, merge results keeping
 * the highest-priority provider for each time slot. Mirrors the plugin's
 * search_with_priority logic in class-ajax-handler.php.
 */
export async function searchAvailabilityWithPriority(
  date: string,
  locationId: string,
  segments: AvailabilitySegmentInput[],
  providerPriority: string[],
): Promise<SquareResult<AvailabilitySlotResult[]>> {
  const merged = new Map<string, AvailabilitySlotResult>();
  for (const tmId of providerPriority) {
    const forced = segments.map((seg) => ({
      ...seg,
      team_member_id: seg.team_member_id || tmId,
    }));
    const result = await searchAvailability(date, locationId, forced);
    if ((result as SquareErrorResponse).error) continue;
    for (const slot of result as AvailabilitySlotResult[]) {
      if (!merged.has(slot.start_at)) {
        merged.set(slot.start_at, slot);
      }
    }
  }
  return [...merged.values()].sort((a, b) =>
    a.start_at < b.start_at ? -1 : a.start_at > b.start_at ? 1 : 0,
  );
}

/**
 * Find the first available date within the next `daysAhead` days. Returns
 * a YYYY-MM-DD string or null if nothing found. Mirrors the plugin's
 * get_next_availability (class-square-api-client.php line 450).
 */
export async function getNextAvailability(
  locationId: string,
  segments: AvailabilitySegmentInput[],
  daysAhead = 60,
): Promise<SquareResult<string | null>> {
  const segmentFilters = buildSegmentFilters(segments);
  const chunkDays = 7;
  let offset = 0;
  while (offset < daysAhead) {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() + offset);
    const end = new Date();
    end.setUTCDate(
      end.getUTCDate() + Math.min(offset + chunkDays, daysAhead),
    );
    const body = {
      query: {
        filter: {
          start_at_range: {
            start_at: start.toISOString().replace(/\.\d+Z$/, "Z"),
            end_at: end.toISOString().replace(/\.\d+Z$/, "Z"),
          },
          location_id: locationId,
          segment_filters: segmentFilters,
        },
      },
    };
    const resp = await request<{ availabilities?: RawAvailability[] }>(
      "POST",
      "/v2/bookings/availability/search",
      body,
    );
    if (!(resp as SquareErrorResponse).error) {
      const r = resp as { availabilities?: RawAvailability[] };
      if (r.availabilities && r.availabilities.length > 0) {
        const first = r.availabilities[0].start_at ?? "";
        return first.slice(0, 10) || null;
      }
    }
    offset += chunkDays;
  }
  return null;
}

export async function getTeamMembers(): Promise<SquareResult<TeamMember[]>> {
  const members: TeamMember[] = [];
  let cursor: string | undefined;
  do {
    const endpoint =
      "/v2/bookings/team-member-booking-profiles?bookable_only=true" +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const resp = await request<{
      team_member_booking_profiles?: RawTeamMemberProfile[];
      cursor?: string;
    }>("GET", endpoint);
    if ((resp as SquareErrorResponse).error) {
      return resp as SquareErrorResponse;
    }
    const r = resp as {
      team_member_booking_profiles?: RawTeamMemberProfile[];
      cursor?: string;
    };
    for (const p of r.team_member_booking_profiles ?? []) {
      members.push({
        id: p.team_member_id,
        display_name: p.display_name ?? "",
      });
    }
    cursor = r.cursor;
  } while (cursor);
  return members;
}

// ── Customers + Cards ───────────────────────────────────────────────────────

export interface CustomerLookupResult {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
}

interface RawCustomer {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
}

interface RawCard {
  id: string;
  enabled?: boolean;
  last_4?: string;
  card_brand?: string;
  exp_month?: number;
  exp_year?: number;
}

export async function searchCustomerByEmail(
  email: string,
): Promise<SquareResult<CustomerLookupResult | null>> {
  const resp = await request<{ customers?: RawCustomer[] }>(
    "POST",
    "/v2/customers/search",
    {
      query: { filter: { email_address: { exact: email } } },
    },
  );
  if ((resp as SquareErrorResponse).error) return resp as SquareErrorResponse;
  const r = resp as { customers?: RawCustomer[] };
  if (!r.customers || r.customers.length === 0) return null;
  const c = r.customers[0];
  return {
    id: c.id,
    given_name: c.given_name ?? "",
    family_name: c.family_name ?? "",
    email: c.email_address ?? email,
  };
}

export async function getCustomerCards(
  customerId: string,
): Promise<SquareResult<SavedCard[]>> {
  const resp = await request<{ cards?: RawCard[] }>(
    "GET",
    `/v2/cards?customer_id=${encodeURIComponent(customerId)}`,
  );
  if ((resp as SquareErrorResponse).error) return resp as SquareErrorResponse;
  const r = resp as { cards?: RawCard[] };
  const cards: SavedCard[] = [];
  for (const c of r.cards ?? []) {
    if (c.enabled === false) continue;
    cards.push({
      id: c.id,
      last_4: c.last_4 ?? "",
      card_brand: c.card_brand ?? "",
      exp_month: c.exp_month ?? 0,
      exp_year: c.exp_year ?? 0,
    });
  }
  return cards;
}

// ── Customer create + card-on-file + booking ────────────────────────────────

function uuid(): string {
  // Use built-in crypto.randomUUID where available; fall back otherwise.
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function findOrCreateCustomer(
  givenName: string,
  familyName: string,
  email: string,
  phone = "",
): Promise<SquareResult<CustomerLookupResult>> {
  const existing = await searchCustomerByEmail(email);
  if (isSquareError(existing)) return existing;
  if (existing !== null) return existing;
  const createBody: Record<string, unknown> = {
    idempotency_key: uuid(),
    given_name: givenName,
    family_name: familyName,
    email_address: email,
  };
  if (phone) createBody.phone_number = phone;
  const resp = await request<{ customer?: RawCustomer }>(
    "POST",
    "/v2/customers",
    createBody,
  );
  if ((resp as SquareErrorResponse).error) return resp as SquareErrorResponse;
  const r = resp as { customer?: RawCustomer };
  const c = r.customer;
  if (!c) {
    return {
      error: true,
      message: "Square did not return a customer.",
      code: "EMPTY_CUSTOMER",
    };
  }
  return {
    id: c.id,
    given_name: c.given_name ?? givenName,
    family_name: c.family_name ?? familyName,
    email: c.email_address ?? email,
  };
}

export async function createCardOnFile(
  nonce: string,
  customerId: string,
): Promise<SquareResult<SavedCard>> {
  const resp = await request<{ card?: RawCard }>("POST", "/v2/cards", {
    idempotency_key: uuid(),
    source_id: nonce,
    card: { customer_id: customerId },
  });
  if ((resp as SquareErrorResponse).error) return resp as SquareErrorResponse;
  const r = resp as { card?: RawCard };
  const c = r.card;
  if (!c) {
    return {
      error: true,
      message: "Square did not return a card.",
      code: "EMPTY_CARD",
    };
  }
  return {
    id: c.id,
    last_4: c.last_4 ?? "",
    card_brand: c.card_brand ?? "",
    exp_month: c.exp_month ?? 0,
    exp_year: c.exp_year ?? 0,
  };
}

export interface CreateBookingInput {
  location_id: string;
  customer_id: string;
  start_at: string;
  segments: Array<{
    service_variation_id: string;
    service_variation_version: number;
    team_member_id: string;
    duration_minutes: number;
  }>;
  customer_note?: string;
}

export interface CreatedBooking {
  id: string;
  status: string;
  start_at: string;
  version: number;
}

interface RawBooking {
  id?: string;
  status?: string;
  start_at?: string;
  version?: number;
}

export async function createBooking(
  data: CreateBookingInput,
): Promise<SquareResult<CreatedBooking>> {
  const bookingData: Record<string, unknown> = {
    location_id: data.location_id,
    customer_id: data.customer_id,
    start_at: data.start_at,
    appointment_segments: data.segments.map((s) => ({
      duration_minutes: s.duration_minutes,
      service_variation_id: s.service_variation_id,
      service_variation_version: s.service_variation_version,
      team_member_id: s.team_member_id,
    })),
  };
  if (data.customer_note) bookingData.customer_note = data.customer_note;
  const resp = await request<{ booking?: RawBooking }>("POST", "/v2/bookings", {
    idempotency_key: uuid(),
    booking: bookingData,
  });
  if ((resp as SquareErrorResponse).error) return resp as SquareErrorResponse;
  const r = resp as { booking?: RawBooking };
  const b = r.booking;
  if (!b?.id) {
    return {
      error: true,
      message: "Square did not return a booking.",
      code: "EMPTY_BOOKING",
    };
  }
  return {
    id: b.id,
    status: b.status ?? "PENDING",
    start_at: b.start_at ?? data.start_at,
    version: b.version ?? 1,
  };
}

export const _internal = { request };
