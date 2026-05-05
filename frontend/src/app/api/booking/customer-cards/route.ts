import { NextResponse } from "next/server";
import { getCustomerCards, searchCustomerByEmail } from "@/lib/square";
import { isSquareError } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

interface RequestBody {
  email?: string;
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  const customer = await searchCustomerByEmail(email);
  if (isSquareError(customer)) {
    return NextResponse.json(
      { error: customer.message, code: customer.code },
      { status: 502 },
    );
  }
  if (customer === null) {
    return NextResponse.json({ customer: null, cards: [] });
  }

  const cards = await getCustomerCards(customer.id);
  if (isSquareError(cards)) {
    return NextResponse.json(
      { error: cards.message, code: cards.code },
      { status: 502 },
    );
  }
  return NextResponse.json({ customer, cards });
}
