"use client";

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

export function UserMenu() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted data-[open]:bg-muted">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
          U
        </div>
        <span className="hidden text-sm font-medium sm:inline">User</span>
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
