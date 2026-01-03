"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/ui/components";
import { getFullUrl } from "@/lib/app-url";

export function SignInButton() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getFullUrl("/auth/callback"),
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <Button onClick={handleSignIn} variant="primary" maxWidth="250px">
      Sign in with Google
    </Button>
  );
}
