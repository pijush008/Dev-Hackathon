import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Your account details</p>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">User ID</p>
            <p className="text-sm text-muted-foreground break-all font-mono">
              {user.id}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Provider</p>
            <p className="text-sm capitalize text-muted-foreground">
              {user.app_metadata.provider ?? "email"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Last Signed In</p>
            <p className="text-sm text-muted-foreground">
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
