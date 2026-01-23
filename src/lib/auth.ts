/**
 * Server-side authentication utilities
 *
 * Use these utilities in server components and API routes.
 * The middleware (proxy.ts) already protects routes, so these are
 * primarily for getting user data, not for authentication checks.
 */

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Get the current authenticated user
 * Returns the user object or null if not authenticated
 *
 * Note: Routes are already protected by middleware, so this mainly
 * just retrieves user data for display/logic purposes.
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  return user;
}

/**
 * Get the current user or redirect to sign-in
 * Use this ONLY in cases where middleware doesn't protect the route
 * (e.g., API routes that aren't covered by middleware matcher)
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return user;
}

/**
 * Get the user's ID for database queries
 * Returns null if not authenticated
 */
export async function getUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

/**
 * Check if a user is authenticated
 * Returns true/false
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * API Route Helper: Get authenticated user or return 401 error
 * Use this in API routes to get the user or automatically return an error response
 *
 * @example
 * export async function GET() {
 *   const { user, error } = await getApiUser();
 *   if (error) return error; // Returns 401 response
 *
 *   // Use user.id for queries
 * }
 */
export async function getApiUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, error: null };
}
