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

    // Create Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Exchange code for session - this will set cookies via setAll
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Use forwardedHost for proper URL in production (Vercel)
      const forwardedHost = request.headers.get("x-forwarded-host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const redirectUrl = forwardedHost
        ? `${protocol}://${forwardedHost}${next}`
        : new URL(next, baseUrl).toString();

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/auth/error", baseUrl));
}
