import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPayment, isRazorpayConfigured } from "@/lib/razorpay";

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const isValid = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const { data: payment } = await supabase
      .from("payments")
      .select("id, plan_name")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .single();

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    await supabase
      .from("payments")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: "captured",
      })
      .eq("id", payment.id);

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan_name: payment.plan_name,
          status: "active",
          razorpay_subscription_id: razorpay_payment_id,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        },
        { onConflict: "user_id,status" }
      )
      .select("id")
      .single();

    if (!subError && subscription) {
      await supabase
        .from("payments")
        .update({ subscription_id: subscription.id })
        .eq("id", payment.id);
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      plan: payment.plan_name,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
