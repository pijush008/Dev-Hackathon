"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Loader2, Database, User, KeyRound } from "lucide-react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

type ConnectionStatus = "loading" | "success" | "error";

export default function SupabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("loading");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function checkConnection() {
      try {
        const { error: healthError } = await supabase
          .from("pg_stat_activity")
          .select("count")
          .limit(1)
          .maybeSingle();

        if (healthError) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError && sessionError.message.includes("Invalid API key")) {
            throw new Error("Invalid API key — check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
          }

          if (sessionData) {
            setConnectionStatus("success");
            setUser(sessionData.session?.user ?? null);
            setSession(sessionData.session);
            return;
          }

          throw healthError;
        }

        setConnectionStatus("success");
      } catch (err) {
        setConnectionStatus("error");
        setConnectionError(
          err instanceof Error ? err.message : "Unknown error occurred",
        );
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supabase Status</h1>
          <p className="mt-1 text-neutral-400">
            Diagnostics for the connected Supabase instance.
          </p>
        </div>

        {/* Connection Status */}
        <Section icon={<Database className="h-5 w-5" />} title="Connection Status">
          <StatusRow
            label="API reachable"
            status={connectionStatus}
            error={connectionError}
          />
        </Section>

        {/* Auth User */}
        <Section icon={<User className="h-5 w-5" />} title="Auth User">
          {connectionStatus === "loading" ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : user ? (
            <div className="space-y-2 text-sm">
              <Row label="ID" value={user.id} />
              <Row label="Email" value={user.email ?? "N/A"} />
              <Row label="Role" value={user.role ?? "N/A"} />
              <Row
                label="Created at"
                value={new Date(user.created_at).toLocaleString()}
              />
              <Row
                label="Last sign-in"
                value={
                  user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "N/A"
                }
              />
              <Row
                label="Metadata"
                value={JSON.stringify(user.user_metadata, null, 2)}
                mono
              />
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No authenticated user.</p>
          )}
        </Section>

        {/* Session */}
        <Section icon={<KeyRound className="h-5 w-5" />} title="Current Session">
          {connectionStatus === "loading" ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : session ? (
            <div className="space-y-2 text-sm">
              <Row label="Token type" value={session.token_type ?? "N/A"} />
              <Row
                label="Provider"
                value={session.user?.app_metadata?.provider ?? "N/A"}
              />
              <Row
                label="Expires at"
                value={new Date(session.expires_at! * 1000).toLocaleString()}
              />
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No active session.</p>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      <div className="mb-4 flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function StatusRow({
  label,
  status,
  error,
}: {
  label: string;
  status: ConnectionStatus;
  error?: string | null;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
        {status === "success" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
        {status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
        <span>
          {status === "loading" && `${label}: Checking...`}
          {status === "success" && `${label}: Connected`}
          {status === "error" && `${label}: Failed`}
        </span>
      </div>
      {status === "error" && error && (
        <pre className="overflow-x-auto rounded-lg bg-red-950/40 p-3 text-xs text-red-400 border border-red-900/50">
          {error}
        </pre>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  truncate,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
      <span className="shrink-0 text-neutral-400">{label}</span>
      <span
        className={`${mono ? "font-mono text-xs" : ""} ${truncate ? "truncate" : "break-all"} text-neutral-200`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
