"use client";

import Link from "next/link";
import { useActionState } from "react";
import { sendPasswordResetEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    sendPasswordResetEmail,
    { error: null, fieldErrors: {}, submitted: false },
  );

  if (state.error === null && state.submitted && !isPending) {
    return (
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Check your email
            </CardTitle>
            <CardDescription>
              We&apos;ve sent password reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex items-center gap-3 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-400"
              role="status"
            >
              <svg
                className="size-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              If an account exists, you&apos;ll receive a reset link shortly.
            </div>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link
                href="/auth/forgot-password"
                className="font-medium text-primary hover:underline"
              >
                try again
              </Link>
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Link
              href="/auth/login"
              className="text-center text-sm font-medium text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Forgot password?
          </CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && (
            <div
              className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              <AlertCircle className="size-4 shrink-0" />
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  autoComplete="email"
                  disabled={isPending}
                  aria-invalid={!!state.fieldErrors?.email}
                  aria-describedby={
                    state.fieldErrors?.email ? "email-error" : undefined
                  }
                />
              </div>
              {state.fieldErrors?.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link
            href="/auth/login"
            className="text-center text-sm font-medium text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
