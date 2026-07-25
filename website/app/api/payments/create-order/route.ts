import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createOrder, isRazorpayConfigured } from "@/lib/razorpay";

const PLAN_PRICES: Record<string, { amount: number; currency: string }> = {
  pro: { amount: 499, currency: "INR" },
  family: { amount: 999, currency: "INR" },
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isRazorpayConfigured) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 503 });
    }

    const { plan } = await request.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { amount, currency } = PLAN_PRICES[plan];

    const order = await createOrder(amount, currency);

    const { error: dbError } = await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount,
      currency,
      plan_name: plan,
      status: "created",
    });

    if (dbError) {
      console.error("Failed to save order:", dbError);
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
