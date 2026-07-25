"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);

  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkout = async (plan: string): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
    setLoading(true);

    try {
      const loaded = await loadScript();
      if (!loaded) {
        return { success: false, error: "Failed to load payment gateway" };
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        return { success: false, error: orderData.error || "Failed to create order" };
      }

      return new Promise((resolve) => {
        const razorpay = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "CareCompass",
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                resolve({ success: true, paymentId: verifyData.paymentId });
              } else {
                resolve({ success: false, error: "Payment verification failed" });
              }
            } catch {
              resolve({ success: false, error: "Payment verification failed" });
            }
          },
          prefill: {
            name: "",
            email: "",
          },
          theme: {
            color: "#059669",
          },
          modal: {
            ondismiss: () => {
              resolve({ success: false, error: "Payment cancelled" });
            },
          },
        });

        razorpay.open();
      });
    } catch {
      return { success: false, error: "Payment failed" };
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
}
