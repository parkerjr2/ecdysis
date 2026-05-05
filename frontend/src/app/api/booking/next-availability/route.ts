import { NextResponse } from "next/server";
import {
  getNextAvailability,
  type AvailabilitySegmentInput,
} from "@/lib/square";
import { isSquareError } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

interface RequestBody {
  location_id?: string;
  segments?: AvailabilitySegmentInput[];
  days_ahead?: number;
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const locationId = body.location_id?.trim();
  const segments = Array.isArray(body.segments) ? body.segments : [];

  if (!locationId || segments.length === 0) {
    return NextResponse.json(
      { error: "Missing location_id or segments." },
      { status: 400 },
    );
  }
  for (const seg of segments) {
    if (!seg.service_variation_id) {
      return NextResponse.json(
        { error: "Each segment must include service_variation_id." },
        { status: 400 },
      );
    }
  }

  const daysAhead = Math.min(Math.max(body.days_ahead ?? 60, 1), 90);
  const result = await getNextAvailability(locationId, segments, daysAhead);
  if (isSquareError(result)) {
    return NextResponse.json(
      { error: result.message, code: result.code },
      { status: 502 },
    );
  }
  return NextResponse.json({ next_date: result });
}
