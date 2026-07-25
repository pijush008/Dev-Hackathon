import "server-only";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const isRazorpayConfigured = !!(keyId && keySecret);

export const razorpay = isRazorpayConfigured
  ? new Razorpay({ key_id: keyId!, key_secret: keySecret! })
  : null;

export async function createOrder(amount: number, currency = "INR") {
  if (!razorpay) throw new Error("Razorpay not configured");
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `receipt_${Date.now()}`,
  });
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  if (!keySecret) throw new Error("Razorpay not configured");
  const crypto = await import("node:crypto");
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
