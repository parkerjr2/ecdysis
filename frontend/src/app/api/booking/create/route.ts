import { NextResponse } from "next/server";
import {
  createBooking,
  createCardOnFile,
  findOrCreateCustomer,
} from "@/lib/square";
import { isSquareError } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

interface SegmentInput {
  service_variation_id: string;
  service_variation_version: number;
  team_member_id: string;
  duration_minutes: number;
}

interface RequestBody {
  location_id?: string;
  start_at?: string;
  segments?: SegmentInput[];
  given_name?: string;
  family_name?: string;
  email?: string;
  phone?: string;
  card_nonce?: string; // optional — when present, save card on file
  saved_customer_id?: string; // optional — skip lookup if returning customer
  saved_card_id?: string; // optional — already on file
  customer_note?: string;
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const locationId = body.location_id?.trim();
  const startAt = body.start_at?.trim();
  const segments = Array.isArray(body.segments) ? body.segments : [];
  const givenName = (body.given_name ?? "").trim();
  const familyName = (body.family_name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();

  if (!locationId || !startAt || segments.length === 0) {
    return NextResponse.json(
      { error: "Missing location_id, start_at, or segments." },
      { status: 400 },
    );
  }
  if (!givenName || !familyName || !email) {
    return NextResponse.json(
      { error: "Missing customer name or email." },
      { status: 400 },
    );
  }
  for (const seg of segments) {
    if (
      !seg.service_variation_id ||
      !seg.team_member_id ||
      !seg.duration_minutes
    ) {
      return NextResponse.json(
        {
          error:
            "Each segment must include service_variation_id, team_member_id, and duration_minutes.",
        },
        { status: 400 },
      );
    }
  }

  // 1. Find or create customer
  let customerId = body.saved_customer_id?.trim() ?? "";
  if (!customerId) {
    const customer = await findOrCreateCustomer(
      givenName,
      familyName,
      email,
      phone,
    );
    if (isSquareError(customer)) {
      return NextResponse.json(
        { error: customer.message, code: customer.code, stage: "customer" },
        { status: 502 },
      );
    }
    customerId = customer.id;
  }

  // 2. Save card on file if a nonce was provided. We DO NOT authorize a
  // payment hold or charge — the live site collects a card on file only.
  let savedCardId = body.saved_card_id?.trim() ?? "";
  if (!savedCardId && body.card_nonce) {
    const card = await createCardOnFile(body.card_nonce, customerId);
    if (isSquareError(card)) {
      return NextResponse.json(
        { error: card.message, code: card.code, stage: "card" },
        { status: 502 },
      );
    }
    savedCardId = card.id;
  }

  // 3. Create booking
  const note = body.customer_note?.trim() || (
    savedCardId ? `Card on file: ${savedCardId}` : ""
  );
  const result = await createBooking({
    location_id: locationId,
    customer_id: customerId,
    start_at: startAt,
    segments,
    customer_note: note,
  });
  if (isSquareError(result)) {
    return NextResponse.json(
      { error: result.message, code: result.code, stage: "booking" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    booking: result,
    customer_id: customerId,
    card_id: savedCardId || null,
  });
}
