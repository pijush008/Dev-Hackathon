import { notFound } from "next/navigation";
import { getPaymentReceipt } from "@/lib/actions/subscription";
import { Receipt } from "@/components/payments/receipt";

interface ReceiptPageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { paymentId } = await params;
  const receipt = await getPaymentReceipt(paymentId);

  if (!receipt) {
    notFound();
  }

  return <Receipt receipt={receipt} />;
}
