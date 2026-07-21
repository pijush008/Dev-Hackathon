"use client";

import { useTransition } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="size-4" />
          Sign out
        </>
      )}
    </Button>
  );
}
