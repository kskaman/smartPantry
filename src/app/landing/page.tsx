"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components";
import { usePWAStatus } from "@/hooks/use-pwa-status";
import { Download, ExternalLink, Share, ChefHat } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const {
    isStandalone, // true when running as installed app (display-mode: standalone)
    isIOS, // iOS device
    isInstalled, // your hook's best guess (Android reliable, iOS not)
    canInstall, // true when beforeinstallprompt available
    promptInstall, // triggers native install prompt (Android/Chrome)
    isInBrowser, // true when NOT standalone
  } = usePWAStatus();

  // 1) If opened in the app (standalone), go to auth
  useEffect(() => {
    if (isStandalone) {
      router.replace("/auth/signin");
    }
  }, [isStandalone, router]);

  // 2) Install flow (Android/Chrome)
  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      // after install, user may still be in browser; you can route anyway
      router.replace("/auth/signin");
    }
  };

  // 3) Open app button (installed but currently in browser)
  const handleOpenApp = () => {
    // Deep link to a route your PWA handles
    window.location.href = `${window.location.origin}/auth/signin`;
  };

  // If standalone, we are redirecting
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[var(--main-page-bg)] flex items-center justify-center">
        <div className="animate-pulse">
          <ChefHat className="h-16 w-16 text-[var(--button-primary-bg)]" />
        </div>
      </div>
    );
  }

  // --- What should we show on the landing page (browser mode) ---

  // A) If installed AND still in browser => show Open App button
  const showOpenApp = isInstalled && isInBrowser;

  // B) If not installed:
  //    - iOS => show instructions
  //    - Android/others => show Install button IF canInstall
  const showIOSInstructions = !isInstalled && isIOS;
  const showInstallButton = !isInstalled && !isIOS && canInstall;

  return (
    <div className="min-h-screen bg-[var(--main-page-bg)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* OPEN APP */}
        {showOpenApp && (
          <div className="w-full max-w-xs space-y-4">
            <Button
              variant="primary"
              onClick={handleOpenApp}
              maxWidth="200px"
              icon={<ExternalLink className="h-5 w-5" />}
            >
              Open App
            </Button>
          </div>
        )}

        {/* ANDROID INSTALL */}
        {!showOpenApp && showInstallButton && (
          <div className="w-full max-w-xs space-y-4">
            <Button
              variant="primary"
              onClick={handleInstall}
              maxWidth="200px"
              icon={<Download className="h-5 w-5" />}
            >
              Install App
            </Button>
          </div>
        )}

        {/* iOS INSTRUCTIONS */}
        {!showOpenApp && showIOSInstructions && (
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-subheading mb-4">Install App (iOS)</h3>

            <div className="space-y-3 text-body">
              <p>
                1. Tap the{" "}
                <Share className="inline h-4 w-4 text-blue-500 mx-1" />{" "}
                <strong>Share</strong> button in Safari
              </p>

              <p>
                2. Tap <strong>&quot;Add to Home Screen&quot;</strong>
              </p>

              <p className="text-sm opacity-70">
                After installing, open the app from your Home Screen.
              </p>
            </div>
          </div>
        )}

        {/* Fallback (optional): if cannot install and not iOS */}
        {!showOpenApp && !showInstallButton && !showIOSInstructions && (
          <div className="w-full max-w-md text-center text-body opacity-80">
            <p>
              Installation isn&apos;t available in this browser. Try Chrome on
              Android or Safari on iOS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
