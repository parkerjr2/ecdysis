"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import type {
  CartItem,
  Service,
  ServiceVariation,
  TeamMember,
} from "@/lib/booking-types";

const VISIBLE_TAB_COUNT = 5;

// Canonical category order — matches the live booking page tabs.
const CATEGORY_ORDER = [
  "Haircut Services",
  "Straight Razor Services",
  "Beard Care",
  "Scalp & Hair Care",
  "Color Services",
  "Styling",
  "Facial Services",
  "Waxing",
  "Massage Therapy",
];

// Hidden services — by NAME so they resolve in both production and sandbox.
const HIDDEN_SERVICE_NAMES = new Set<string>([
  "additional product",
  "Braiding - not bookable by customers",
]);

// Per-category service display order — by NAME. Services not listed are
// appended in their natural Square order.
const SERVICE_DISPLAY_ORDER_NAMES: Record<string, string[]> = {
  "Haircut Services": [
    "Standard Cut",
    "Buzz Cut",
    "Kids' Cut",
    "Transformation Cut",
    "Long Technical Cut",
    "Straight Razor Fade",
    "Straight Razor Head Shave",
    "Designs",
    "Haircut Consultation",
  ],
  "Straight Razor Services": [
    "Straight Razor Fade",
    "Straight Razor Head Shave",
    "Straight Razor Beard Edge-up",
    "Straight Razor Hairline Edge-up",
    "Straight Razor Partial Edge-up",
    "Straight Razor Full Face Shave",
    "Beard Mask",
    "Facial Steamer",
  ],
  "Beard Care": [
    "Beard Sculpting",
    "Beard Clean Up",
    "Straight Razor Beard Edge-up",
    "Straight Razor Hairline Edge-up",
    "Straight Razor Partial Edge-up",
    "Beard Mask",
    "Facial Steamer",
  ],
  "Scalp & Hair Care": [
    "Scalp Scrub",
    "Relaxing Shampoo",
    "Deep Condition",
    "Bond Fusion Blowout",
  ],
  "Color Services": [
    "Color Consultation",
    "Base Color",
    "Base Highlights",
    "Base Highlights & Color",
    "Base Vivid Color",
    "Color Correction",
    "additional product",
  ],
  Styling: [
    "Thermal Styling",
    "Partial Updo",
    "Full Updo",
    "Relaxing Shampoo & Blow Out",
    "Styling Consultation",
    "Braiding Consultation",
    "Braiding - not bookable by customers",
  ],
  "Facial Services": ["Beard Mask", "Mini Facial", "Black Mask", "Facial Steamer"],
  Waxing: ["Unibrow", "Ears"],
  "Massage Therapy": ["Chair Massage - 15 Minutes", "Chair Massage - 25 Minutes"],
};

// New-client booking rules — name-based so they work in both production and
// sandbox (Square IDs differ between environments; service names match).
//
// CONSULTATION_MAP_NAMES: category name → consultation service NAME. When a
// new client adds a trigger service in that category, the matching
// consultation is auto-added (locked) to the cart.
const CONSULTATION_MAP_NAMES: Record<string, string> = {
  "Color Services": "Color Consultation",
  "Haircut Services": "Haircut Consultation",
  Styling: "Styling Consultation",
};

// Services Requiring Consultation — by NAME. New clients booking any of
// these auto-get the matching consultation added.
const CONSULTATION_SERVICE_NAMES = new Set<string>([
  "Standard Cut",
  "Buzz Cut",
  "Kids' Cut",
  "Long Technical Cut",
  "Transformation Cut",
  "Straight Razor Fade",
  "Base Color",
  "Base Highlights",
  "Base Highlights & Color",
  "Base Vivid Color",
  "Color Correction",
  "Thermal Styling",
  "Partial Updo",
  "Full Updo",
  "Relaxing Shampoo & Blow Out",
]);

// Categories where new clients can ONLY book a consultation, not regular
// services. (Admin "Consultation Only" checkbox.)
const NO_SAMEDAY_CATEGORIES = new Set<string>(["Color Services"]);

// All known consultation service names — used to detect whether the cart
// already contains a consultation.
const ALL_CONSULTATION_NAMES = new Set<string>(
  Object.values(CONSULTATION_MAP_NAMES),
);

// Provider priority — pulled from the live admin's "Provider Priority"
// (Booking Rules → Scheduling). Used to sort barber-picker cards.
const PROVIDER_PRIORITY: string[] = [
  "TMO_cCpFZJkQZ-JO", // Rafael
  "TMRlJY7f8ppC-dJd", // Kory
  "TMD8wQstf2MLL06n", // Courtney Layne
  "TMbmQTCgttqWwHoK", // Cornelius Johnson
];

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 hr" : `${h} hr`;
  return `${h} hr ${m} min`;
}

function formatPrice(amountCents: number, currency: string): string {
  if (amountCents === 0) return "Free";
  const dollars = amountCents / 100;
  if (currency === "USD") {
    return `$${dollars.toFixed(2)}`;
  }
  return `${currency} ${dollars.toFixed(2)}`;
}

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ServiceStep() {
  const { state, dispatch } = useBooking();
  const [services, setServices] = useState<Service[] | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  // When set, the panel renders the barber picker instead of the service
  // browse — matches the plugin's flow: click Add → pick barber → cart add.
  const [pickerFor, setPickerFor] = useState<
    | {
        service: Service;
        variation: ServiceVariation;
      }
    | null
  >(null);

  // Fetch services + team members on mount
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/booking/services").then((r) => r.json()),
      fetch("/api/booking/team-members").then((r) => r.json()),
    ])
      .then(([s, t]) => {
        if (cancelled) return;
        if (s.error) throw new Error(s.error);
        if (t.error) throw new Error(t.error);
        setServices(s.services as Service[]);
        setTeamMembers(t.team_members as TeamMember[]);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message ?? "Failed to load services");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Group services by EVERY category they're tagged with (multi-category
  // services appear under each tab — matches plugin behavior). Hidden services
  // are filtered out and within each category services are sorted by the
  // canonical SERVICE_DISPLAY_ORDER (anything unlisted appended at the end).
  const grouped = useMemo(() => {
    if (!services) return null;
    const visible = services.filter(
      (s) => !HIDDEN_SERVICE_NAMES.has(s.name),
    );
    const map = new Map<string, Service[]>();
    for (const s of visible) {
      const cats = s.category_names.length > 0 ? s.category_names : ["Other"];
      for (const cat of cats) {
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(s);
      }
    }

    for (const [cat, list] of map.entries()) {
      const order = SERVICE_DISPLAY_ORDER_NAMES[cat] ?? [];
      list.sort((a, b) => {
        const ai = order.indexOf(a.name);
        const bi = order.indexOf(b.name);
        return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi);
      });
    }

    const seen = new Set<string>();
    const order: string[] = [];
    for (const c of CATEGORY_ORDER) {
      if (map.has(c)) {
        order.push(c);
        seen.add(c);
      }
    }
    for (const c of map.keys()) {
      if (!seen.has(c)) order.push(c);
    }
    return { order, map };
  }, [services]);

  // Default active category to the first one once services arrive.
  useEffect(() => {
    if (grouped && !activeCategory && grouped.order.length > 0) {
      setActiveCategory(grouped.order[0]);
    }
  }, [grouped, activeCategory]);

  // Close the More dropdown when clicking outside.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [moreOpen]);

  const visibleTabs = grouped ? grouped.order.slice(0, VISIBLE_TAB_COUNT) : [];
  const overflowTabs = grouped ? grouped.order.slice(VISIBLE_TAB_COUNT) : [];
  const showMore = overflowTabs.length > 0;
  const overflowActive =
    activeCategory !== null && overflowTabs.includes(activeCategory);
  const activeServices =
    grouped && activeCategory ? (grouped.map.get(activeCategory) ?? []) : [];

  // For new clients, services in a "Consultation Only" category are blocked
  // — they can only book the consultation in that category. The consultation
  // service itself is never blocked.
  const isBlockedForNewClient = (svc: Service): boolean => {
    if (state.clientType !== "new") return false;
    if (NO_SAMEDAY_CATEGORIES.size === 0) return false;
    if (ALL_CONSULTATION_NAMES.has(svc.name)) return false;
    return svc.category_names.some((c) => NO_SAMEDAY_CATEGORIES.has(c));
  };

  // After adding a trigger service, auto-prepend the locked consultation to
  // the cart for new clients. Mirrors the plugin's maybeAutoAddConsultation.
  // The consultation inherits the trigger's team member (plugin line 1033).
  const maybeAutoAddConsultation = (added: CartItem) => {
    if (state.clientType !== "new") return;
    // Already have any consultation (locked or unlocked) in cart?
    const hasConsultation = state.cart.some(
      (item) =>
        item.locked || ALL_CONSULTATION_NAMES.has(item.service.name),
    );
    if (hasConsultation) return;
    // Is the added service a trigger?
    if (!CONSULTATION_SERVICE_NAMES.has(added.service.name)) return;
    // Look up the consultation service NAME by category.
    let consultName = "";
    for (const cat of added.service.category_names) {
      if (CONSULTATION_MAP_NAMES[cat]) {
        consultName = CONSULTATION_MAP_NAMES[cat];
        break;
      }
    }
    if (!consultName || !services) return;
    // Resolve the consultation service + its first variation by name.
    const consultSvc = services.find((s) => s.name === consultName) ?? null;
    const consultVar = consultSvc?.variations[0] ?? null;
    if (!consultSvc || !consultVar) return;
    dispatch({
      type: "ADD_TO_CART",
      item: {
        service: consultSvc,
        variation: consultVar,
        teamMember: added.teamMember,
        locked: true,
        personKey: "primary",
      },
    });
  };

  // Click "Add" on a service row → open the barber picker.
  const openPicker = (service: Service, variation: ServiceVariation) => {
    setPickerFor({ service, variation });
  };

  // Pick a barber (or "Any available") in the picker → add to cart and return
  // to the service browse.
  const addWithBarber = (
    service: Service,
    variation: ServiceVariation,
    teamMember: TeamMember | null,
  ) => {
    const item: CartItem = {
      service,
      variation,
      teamMember,
      personKey: "primary",
    };
    dispatch({ type: "ADD_TO_CART", item });
    maybeAutoAddConsultation(item);
    setPickerFor(null);
  };

  // Eligible barbers for a variation, sorted by provider priority.
  const eligibleBarbers = (variation: ServiceVariation): TeamMember[] => {
    if (!teamMembers) return [];
    const allowed = new Set(variation.team_member_ids);
    const filtered =
      allowed.size > 0
        ? teamMembers.filter((m) => allowed.has(m.id))
        : teamMembers.slice();
    filtered.sort((a, b) => {
      const ai = PROVIDER_PRIORITY.indexOf(a.id);
      const bi = PROVIDER_PRIORITY.indexOf(b.id);
      return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi);
    });
    return filtered;
  };

  const handleRemove = (variationId: string) => {
    // Locked consultations cannot be removed manually.
    const target = state.cart.find((c) => c.variation.id === variationId);
    if (target?.locked) return;
    // Plan: remove the target, plus any locked items if no non-locked trigger
    // services remain in the cart afterwards (matches plugin behavior).
    const remaining = state.cart.filter((c) => c.variation.id !== variationId);
    const stillHasTrigger = remaining.some(
      (c) => !c.locked && CONSULTATION_SERVICE_NAMES.has(c.service.name),
    );
    const idsToRemove = [variationId];
    if (!stillHasTrigger) {
      for (const item of remaining) {
        if (item.locked) idsToRemove.push(item.variation.id);
      }
    }
    for (const id of idsToRemove) {
      dispatch({
        type: "REMOVE_FROM_CART",
        variationId: id,
        personKey: "primary",
      });
    }
  };

  const isInCart = (variationId: string) =>
    state.cart.some((c) => c.variation.id === variationId);

  const cartTotal = state.cart.reduce(
    (sum, c) => sum + c.variation.price_amount,
    0,
  );

  return (
    <div className="ecdy-booking__panel">
      <h2 className="ecdy-booking__panel-title">Select a Service</h2>

      {loadError && (
        <div className="ecdy-booking__error" role="alert">
          {loadError}
        </div>
      )}

      {!grouped && !loadError && (
        <div className="ecdy-booking__loading">Loading services…</div>
      )}

      {grouped && pickerFor && (
        <div className="ecdy-booking__barber-picker">
          <button
            type="button"
            className="ecdy-booking__back-link"
            onClick={() => setPickerFor(null)}
          >
            ← Back to services
          </button>
          <h3 className="ecdy-booking__barber-heading">
            Who would you like for {pickerFor.service.name}?
          </h3>
          <button
            type="button"
            className="ecdy-booking__card"
            onClick={() =>
              addWithBarber(pickerFor.service, pickerFor.variation, null)
            }
          >
            <div className="ecdy-booking__card-title">
              Any available provider
            </div>
          </button>
          {eligibleBarbers(pickerFor.variation).map((member) => (
            <button
              key={member.id}
              type="button"
              className="ecdy-booking__card"
              onClick={() =>
                addWithBarber(pickerFor.service, pickerFor.variation, member)
              }
            >
              <div className="ecdy-booking__card-title">
                {member.display_name.trim()}
              </div>
            </button>
          ))}
        </div>
      )}

      {grouped && !pickerFor && (
        <div className="ecdy-booking__service-layout">
          <div className="ecdy-booking__service-main">
            <div className="ecdy-booking__tabs-wrapper">
              <div className="ecdy-booking__tabs" role="tablist">
                {visibleTabs.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={
                        "ecdy-booking__tab" + (isActive ? " is-active" : "")
                      }
                      onClick={() => {
                        setActiveCategory(cat);
                        setMoreOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}

                {showMore && (
                  <div
                    ref={moreRef}
                    className={
                      "ecdy-booking__more-container" +
                      (moreOpen ? " is-open" : "")
                    }
                  >
                    <button
                      type="button"
                      className={
                        "ecdy-booking__tab ecdy-booking__more-btn" +
                        (overflowActive ? " is-active" : "")
                      }
                      onClick={() => setMoreOpen((o) => !o)}
                      aria-expanded={moreOpen}
                    >
                      More <ChevronDown />
                    </button>
                    <div className="ecdy-booking__more-dropdown" role="menu">
                      {overflowTabs.map((cat) => {
                        const isActive = cat === activeCategory;
                        return (
                          <button
                            key={cat}
                            type="button"
                            role="menuitem"
                            className={
                              "ecdy-booking__more-item" +
                              (isActive ? " is-active" : "")
                            }
                            onClick={() => {
                              setActiveCategory(cat);
                              setMoreOpen(false);
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ecdy-booking__service-scroll" role="tabpanel">
              {activeServices.map((service) => {
                // Single-variation case: render one row.
                if (service.variations.length === 1) {
                  const v = service.variations[0];
                  const inCart = isInCart(v.id);
                  const blocked = isBlockedForNewClient(service);
                  return (
                    <div
                      key={service.id}
                      className="ecdy-booking__service-row"
                    >
                      <div className="ecdy-booking__service-info">
                        <span className="ecdy-booking__service-name">
                          {service.name}
                        </span>
                        {service.description && (
                          <span className="ecdy-booking__service-desc">
                            {service.description}
                          </span>
                        )}
                      </div>
                      <span className="ecdy-booking__service-meta">
                        {formatDuration(v.duration_minutes)} ·{" "}
                        {formatPrice(v.price_amount, v.price_currency)}
                      </span>
                      {blocked && !inCart ? (
                        <span className="ecdy-booking__blocked-badge">
                          Consultation required
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={
                            "ecdy-booking__btn--add" +
                            (inCart ? " is-added" : "")
                          }
                          onClick={() =>
                            inCart
                              ? handleRemove(v.id)
                              : openPicker(service, v)
                          }
                        >
                          {inCart ? "Added" : "Add"}
                        </button>
                      )}
                    </div>
                  );
                }

                // Multi-variation: parent row with no Add button, then a row
                // per variation below.
                return (
                  <div key={service.id}>
                    <div className="ecdy-booking__service-row">
                      <div className="ecdy-booking__service-info">
                        <span className="ecdy-booking__service-name">
                          {service.name}
                        </span>
                        {service.description && (
                          <span className="ecdy-booking__service-desc">
                            {service.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {service.variations.map((v) => {
                      const inCart = isInCart(v.id);
                      return (
                        <div
                          key={v.id}
                          className="ecdy-booking__service-row"
                          style={{ paddingLeft: 24 }}
                        >
                          <div className="ecdy-booking__service-info">
                            <span className="ecdy-booking__service-name">
                              {v.name || "Option"}
                            </span>
                          </div>
                          <span className="ecdy-booking__service-meta">
                            {formatDuration(v.duration_minutes)} ·{" "}
                            {formatPrice(v.price_amount, v.price_currency)}
                          </span>
                          <button
                            type="button"
                            className={
                              "ecdy-booking__btn--add" +
                              (inCart ? " is-added" : "")
                            }
                            onClick={() =>
                              inCart
                                ? handleRemove(v.id)
                                : openPicker(service, v)
                            }
                          >
                            {inCart ? "Added" : "Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="ecdy-booking__service-sidebar">
            {state.cart.length === 0 ? (
              <div className="ecdy-booking__cart is-empty">
                Select a service to begin.
              </div>
            ) : (
              <div className="ecdy-booking__cart">
                <h3 className="ecdy-booking__cart-heading">Your Selections</h3>
                {state.cart.map((c) => (
                  <div key={c.variation.id} className="ecdy-booking__cart-item">
                    <div className="ecdy-booking__cart-item-left">
                      <div className="ecdy-booking__cart-item-name">
                        {c.service.name}
                      </div>
                      <div className="ecdy-booking__cart-item-meta">
                        {(c.teamMember?.display_name.trim() ||
                          "Any available")}{" "}
                        · {formatDuration(c.variation.duration_minutes)}
                      </div>
                    </div>
                    <div className="ecdy-booking__cart-item-right">
                      <span className="ecdy-booking__cart-item-price">
                        {formatPrice(
                          c.variation.price_amount,
                          c.variation.price_currency,
                        )}
                      </span>
                      {c.locked ? (
                        <span className="ecdy-booking__cart-item-required">
                          Required
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="ecdy-booking__btn--remove"
                          aria-label={`Remove ${c.service.name}`}
                          onClick={() => handleRemove(c.variation.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="ecdy-booking__cart-total">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal, "USD")}</span>
                </div>
                <button
                  type="button"
                  className="ecdy-booking__btn ecdy-booking__btn--primary"
                  onClick={() => dispatch({ type: "SET_STEP", step: "datetime" })}
                  disabled={state.cart.length === 0}
                >
                  Next →
                </button>
              </div>
            )}

            <div className="ecdy-booking__actions ecdy-booking__actions--sidebar">
              <button
                type="button"
                className="ecdy-booking__btn ecdy-booking__btn--secondary"
                onClick={() => dispatch({ type: "SET_STEP", step: "location" })}
              >
                Back
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
