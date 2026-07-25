"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Bell, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export default function SettingsPage() {
  const { user, displayName, email, initials } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </div>
            <div>
              <p className="font-semibold">{displayName}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <User className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px]">Verified</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Shield className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Last changed recently</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">Change</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">Manage notification preferences</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">Configure</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <Button variant="destructive" className="w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
