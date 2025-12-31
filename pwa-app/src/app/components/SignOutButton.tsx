"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton({ children, className }: { children?: React.ReactNode; className?: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <button onClick={handleSignOut} className={className}>
      {children || "Sign Out"}
    </button>
  );
}
