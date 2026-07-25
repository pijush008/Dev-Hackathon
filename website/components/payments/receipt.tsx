"use client";

import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import type { PaymentReceipt } from "@/lib/actions/subscription";

interface ReceiptProps {
  receipt: PaymentReceipt;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount / 100);
}

export function Receipt({ receipt }: ReceiptProps) {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Download className="mr-1 size-4" />
            Download PDF
          </Button>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <h1 className="text-xl font-bold">CareCompass</h1>
              <p className="text-xs text-muted-foreground">Healthcare Platform</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Payment Receipt
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(receipt.createdAt)}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="border-b py-6 text-center">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">
              {formatCurrency(receipt.amount, receipt.currency)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {receipt.planName.charAt(0).toUpperCase() + receipt.planName.slice(1)} Plan
              {receipt.status === "captured" && " (Confirmed)"}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 border-b py-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Receipt ID</span>
              <span className="font-mono text-xs">{receipt.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs">{receipt.razorpayOrderId}</span>
            </div>
            {receipt.razorpayPaymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-xs">{receipt.razorpayPaymentId}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">{receipt.planName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${receipt.status === "captured" ? "text-emerald-600" : "text-amber-600"}`}>
                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-3 py-6">
            <p className="text-xs font-medium uppercase text-muted-foreground">Billed To</p>
            <div className="text-sm">
              <p className="font-medium">{receipt.userName}</p>
              <p className="text-muted-foreground">{receipt.userEmail}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-lg bg-muted/50 p-4 text-center text-xs text-muted-foreground">
            <p>This is a computer-generated receipt. No signature required.</p>
            <p className="mt-1">
              For support, contact{" "}
              <span className="font-medium text-foreground">support@carecompass.app</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
