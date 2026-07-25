"use server";

import { createClient } from "@/lib/supabase/server";

export interface SubscriptionInfo {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

export async function getSubscription(): Promise<SubscriptionInfo | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("plan_name, status, current_period_end")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;

  return {
    plan: data.plan_name,
    status: data.status,
    currentPeriodEnd: data.current_period_end,
  };
}

export interface PaymentReceipt {
  id: string;
  amount: number;
  currency: string;
  planName: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  createdAt: string;
  userName: string;
  userEmail: string;
}

export async function getPaymentReceipt(paymentId: string): Promise<PaymentReceipt | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: payment } = await supabase
    .from("payments")
    .select("id, amount, currency, plan_name, status, razorpay_order_id, razorpay_payment_id, created_at")
    .eq("id", paymentId)
    .eq("user_id", user.id)
    .single();

  if (!payment) return null;

  return {
    id: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    planName: payment.plan_name,
    status: payment.status,
    razorpayOrderId: payment.razorpay_order_id,
    razorpayPaymentId: payment.razorpay_payment_id,
    createdAt: payment.created_at,
    userName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    userEmail: user.email || "",
  };
}
