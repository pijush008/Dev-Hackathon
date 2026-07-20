import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export async function createOrder(amount: number, currency = "INR") {
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
  const crypto = await import("node:crypto");
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}
