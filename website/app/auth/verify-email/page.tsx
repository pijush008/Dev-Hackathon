"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <div className="mb-2 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                1
              </div>
              <div className="text-sm">
                <p className="font-medium">Open your email inbox</p>
                <p className="text-muted-foreground">
                  Look for an email from CareCompass
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                2
              </div>
              <div className="text-sm">
                <p className="font-medium">Click the verification link</p>
                <p className="text-muted-foreground">
                  The link expires in 24 hours
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                3
              </div>
              <div className="text-sm">
                <p className="font-medium">Return here and sign in</p>
                <p className="text-muted-foreground">
                  Your account will be ready to use
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              sign up again
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
