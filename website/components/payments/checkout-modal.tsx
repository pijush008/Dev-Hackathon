"use client";

import { useState } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CreditCard, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
  price: string;
}

export function CheckoutModal({ open, onOpenChange, plan, price }: CheckoutModalProps) {
  const { checkout, loading } = useRazorpay();
  const [result, setResult] = useState<{ success: boolean; paymentId?: string; error?: string } | null>(null);

  const handleCheckout = async () => {
    const res = await checkout(plan);
    setResult(res);
    if (res.success && res.paymentId) {
      window.open(`/receipt/${res.paymentId}`, "_blank");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleClose = () => {
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-emerald-600" />
            Upgrade to {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Complete your subscription to unlock premium features.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </span>
                <span className="text-lg font-bold">{price}/mo</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Billed monthly. Cancel anytime.
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600" />
                <span>Instant access to all premium features</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-3.5 text-emerald-600" />
                <span>Secured by Razorpay (Test Mode)</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleCheckout} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${price}`
                )}
              </Button>
            </DialogFooter>
          </>
        ) : result.success ? (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Check className="size-6 text-emerald-600" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">Payment Successful!</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Your receipt has been opened in a new tab.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <span className="text-lg">!</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">Payment Failed</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.error || "Something went wrong. Please try again."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCheckout} disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Retry
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
