import { NextResponse } from "next/server";
import { getTeamMembers } from "@/lib/square";
import { isSquareError } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getTeamMembers();
  if (isSquareError(result)) {
    return NextResponse.json(
      { error: result.message, code: result.code },
      { status: 502 },
    );
  }
  return NextResponse.json({ team_members: result });
}
