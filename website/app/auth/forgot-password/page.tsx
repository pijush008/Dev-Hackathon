"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { sendPasswordResetEmail, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { error: null };

export default function ForgotPasswordPage() {
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await sendPasswordResetEmail(initialState, formData);
      if (!result.error) {
        setSent(true);
      } else {
        setState(result);
      }
    });
  }

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          {sent ? (
            <>
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-6 text-emerald-500" />
              </div>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent a password reset link to your email address.
                Follow the link to create a new password.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Forgot password?</CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you a link to
                reset your password.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSent(false)}
              >
                Try another email
              </Button>
            </>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={isPending}
                  aria-invalid={!!state.fieldErrors?.email}
                />
                {state.fieldErrors?.email && (
                  <p className="text-xs text-destructive">
                    {state.fieldErrors.email}
                  </p>
                )}
              </div>

              {state.error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          )}

          <Link
            href="/auth/login"
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-transparent px-2.5 text-sm font-medium outline-none transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
