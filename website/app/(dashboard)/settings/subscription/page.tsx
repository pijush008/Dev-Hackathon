"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Loader2 } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { getSubscription } from "@/lib/actions/subscription";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "AI Companion (limited)",
      "Mood tracking",
      "Medication reminders",
      "Basic notifications",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    features: [
      "Unlimited AI Companion",
      "Advanced mood analytics",
      "Full medication management",
      "Priority support",
      "Care team collaboration",
      "Crisis detection AI",
    ],
    popular: true,
  },
  {
    id: "family",
    name: "Family",
    price: 999,
    features: [
      "Everything in Pro",
      "Up to 5 family members",
      "Shared care plans",
      "Family dashboard",
      "Dedicated care coordinator",
    ],
  },
];

export default function SubscriptionPage() {
  const { checkout, loading: checkoutLoading } = useRazorpay();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getSubscription()
      .then((sub) => {
        if (sub && sub.status === "active") {
          setCurrentPlan(sub.plan.toLowerCase());
        } else {
          setCurrentPlan("free");
        }
      })
      .catch(() => setCurrentPlan("free"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;
    setMessage(null);

    const result = await checkout(planId);

    if (result.success) {
      setMessage("Payment successful! Your plan has been upgraded.");
      setCurrentPlan(planId);
    } else if (result.error) {
      setMessage(result.error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Choose the plan that works best for you.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border bg-muted p-3 text-sm">{message}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <Card
                key={plan.id}
                className={plan.popular ? "border-primary shadow-md" : ""}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {plan.popular && <Crown className="size-4 text-primary" />}
                      {plan.name}
                    </CardTitle>
                    {isCurrent && <Badge>Current</Badge>}
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Free" : `₹${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        /month
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || checkoutLoading || plan.id === "free"}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {checkoutLoading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    {isCurrent
                      ? "Current Plan"
                      : plan.id === "free"
                        ? "Included"
                        : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
