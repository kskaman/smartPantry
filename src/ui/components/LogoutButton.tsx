"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/ui/components";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut} variant="primary" width="120px">
      <div className="flex items-center gap-2 justify-center">
        <LogOut className="rotate-180" />
        <span className="hidden md:inline">Logout</span>
      </div>
    </Button>
  );
}
