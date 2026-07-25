import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { ArrowLeft, Shield, Calendar, Mail, Hash } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const email = user.email ?? "N/A";
  const initials = email
    .split("@")[0]
    .split("+")[0]
    .slice(0, 2)
    .toUpperCase();
  const provider = user.app_metadata.provider ?? "email";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {initials}
              </div>
              <div>
                <CardTitle className="text-lg">{email}</CardTitle>
                <CardDescription>
                  {provider === "email" ? "Email account" : `Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-sm text-muted-foreground break-all font-mono">
                    {user.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Provider</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {provider}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Account created</p>
                  <p className="text-sm text-muted-foreground">{createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last signed in</p>
                  <p className="text-sm text-muted-foreground">{lastSignIn}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
