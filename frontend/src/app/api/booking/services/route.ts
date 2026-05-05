import { NextResponse } from "next/server";
import { getServices } from "@/lib/square";
import { isSquareError } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getServices();
  if (isSquareError(result)) {
    return NextResponse.json(
      { error: result.message, code: result.code },
      { status: 502 },
    );
  }
  return NextResponse.json({ services: result });
}
