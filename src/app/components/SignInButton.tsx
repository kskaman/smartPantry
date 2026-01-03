"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/ui/components";

export function SignInButton() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
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
