import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard/home";

  if (code) {
    const supabase = await createServerClient();
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Force a hard redirect to ensure cookies are set properly
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
    
    console.error("Auth callback error:", error);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
}
