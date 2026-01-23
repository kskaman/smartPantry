"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/ui/components";
import { AlertCircle, ArrowLeft, LogIn } from "lucide-react";

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="main-page">
      <div className="w-full max-w-md flex items-center justify-center flex-col gap-6">
        <div className="w-16 h-16 rounded-full bg-(--warning-color)/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-(--warning-color)" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-heading text-(--text-title)">
            Authentication Error
          </h1>
          <p className="text-body text-(--text-secondary)">
            Something went wrong during authentication.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => router.push("/auth/signin")}
            icon={<LogIn className="h-4 w-4" />}
            width="100%"
          >
            Go to Sign In
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            icon={<ArrowLeft className="h-4 w-4" />}
            width="100%"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
