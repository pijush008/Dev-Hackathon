"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

export interface AuthState {
  error: string | null;
  fieldErrors?: Record<string, string>;
}

function formatZodError(error: {
  issues: Array<{ message: string; path: readonly PropertyKey[] }>;
}): AuthState {
  const fieldErrors: Record<string, string> = {};
  const generalErrors: string[] = [];

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string") {
      fieldErrors[field] = issue.message;
    } else {
      generalErrors.push(issue.message);
    }
  }

  return {
    error: generalErrors.length > 0 ? generalErrors.join(". ") : null,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
  };
}

export async function signInWithEmail(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return formatZodError(parsed.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    console.error("Sign in error:", error.message);
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password. Please try again." };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUpWithEmail(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return formatZodError(parsed.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    console.error("Sign up error:", error.message);
    if (error.message.includes("already registered")) {
      return {
        error: "An account with this email already exists. Please sign in.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/verify-email");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    console.error("Google OAuth error:", error.message);
    redirect("/auth/login?error=google_auth_failed");
  }
  redirect(data.url);
}

export async function sendPasswordResetEmail(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return formatZodError(parsed.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/reset-password`,
  });

  if (error) {
    console.error("Password reset email error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}

export async function updatePassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return formatZodError(parsed.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    console.error("Update password error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/login?reset=success");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}