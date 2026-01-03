import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard/home";

  // Use the request origin (this will be the correct deployment URL)
  const baseUrl = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    
    // Create the redirect response
    const response = NextResponse.redirect(new URL(next, baseUrl));
    
    // Create Supabase client with cookie handling that writes to response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // Set cookies on both the cookie store and response
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Return response with cookies set
      return response;
    }

    console.error("Auth callback error:", error);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/auth/error", baseUrl));
}
