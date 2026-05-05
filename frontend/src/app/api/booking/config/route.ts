import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Returns the public-safe booking config the client needs:
// - Square application_id (used to initialize the Web Payments SDK)
// - Default Square location_id (used for tokenization + booking creation)
// - Environment ('production' or 'sandbox')
// These values are not secrets — they identify the merchant's public Square
// app and are intended to be used in browser code.
export function GET() {
  return NextResponse.json({
    application_id: process.env.SQUARE_APPLICATION_ID ?? "",
    location_id: process.env.SQUARE_DEFAULT_LOCATION_ID ?? "",
    environment: process.env.SQUARE_ENVIRONMENT ?? "sandbox",
  });
}
