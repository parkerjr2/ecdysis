import { NextResponse } from "next/server";
import {
  getTeamMembers,
  searchAvailability,
  searchAvailabilityWithPriority,
  type AvailabilitySegmentInput,
} from "@/lib/square";
import { isSquareError } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

// Provider priority — order matches the live admin's "Provider Priority"
// (Booking Rules → Scheduling). Stored by NAME so it works against both
// production and sandbox (sandbox has different team-member IDs but the
// same display names).
const PROVIDER_PRIORITY_NAMES: string[] = [
  "Rafael",
  "Kory",
  "Courtney",
  "Cornelius",
];

// Cache the resolved priority list (name → ID) so we don't refetch
// team-members on every availability request.
let priorityIdsCache: string[] | null = null;

async function resolveProviderPriority(): Promise<string[]> {
  if (priorityIdsCache) return priorityIdsCache;
  const members = await getTeamMembers();
  if (isSquareError(members)) return [];
  const ordered: string[] = [];
  for (const namePrefix of PROVIDER_PRIORITY_NAMES) {
    const match = members.find((m) =>
      m.display_name.trim().toLowerCase().startsWith(namePrefix.toLowerCase()),
    );
    if (match) ordered.push(match.id);
  }
  priorityIdsCache = ordered;
  return ordered;
}

interface RequestBody {
  date?: string;
  location_id?: string;
  segments?: AvailabilitySegmentInput[];
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const date = body.date?.trim();
  const locationId = body.location_id?.trim();
  const segments = Array.isArray(body.segments) ? body.segments : [];

  if (!date || !locationId || segments.length === 0) {
    return NextResponse.json(
      { error: "Missing date, location_id, or segments." },
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

  // If any segment has no specific provider AND we have a priority list,
  // use the per-provider merge. Otherwise do a single search.
  const anyProvider = segments.some((s) => !s.team_member_id);
  const priority = anyProvider ? await resolveProviderPriority() : [];
  const result =
    anyProvider && priority.length > 0
      ? await searchAvailabilityWithPriority(
          date,
          locationId,
          segments,
          priority,
        )
      : await searchAvailability(date, locationId, segments);

  if (isSquareError(result)) {
    return NextResponse.json(
      { error: result.message, code: result.code },
      { status: 502 },
    );
  }
  return NextResponse.json({ availability: result });
}
