"use client";

import { useEffect, useState } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPopup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split("+")[0]
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const displayName = userEmail?.split("@")[0] ?? "User";

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted data-[open]:bg-muted">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
          {initials}
        </div>
        <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
        <ChevronDown className="hidden size-3 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuPopup>
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => startTransition(() => signOut())}
          disabled={isPending}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuPopup>
    </DropdownMenuRoot>
  );
}
