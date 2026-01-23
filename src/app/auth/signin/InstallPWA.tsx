"use client";

import { useState } from "react";
import { Button } from "@/ui/components";
import { usePWAStatus } from "@/hooks/use-pwa-status";
import { Download, Share, X } from "lucide-react";

export default function InstallPWA() {
  const { isStandalone, isIOS, isInstalled, canInstall, promptInstall } =
    usePWAStatus();

  const [showIOSModal, setShowIOSModal] = useState(false);

  // If running inside the installed app, don't show install UI
  if (isStandalone) return null;

  // If already installed, don't show install UI
  // (iOS Safari may not always detect this, but we'll honor your hook)
  if (isInstalled) return null;

  const showAndroidInstall = !isIOS && canInstall;
  const showIOSInstall = isIOS;

  const handleInstall = async () => {
    await promptInstall();
  };

  return (
    <>
      {/* Android / Chrome install button */}
      {showAndroidInstall && (
        <div className="w-full max-w-xs space-y-3">
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

      {/* iOS install instructions trigger */}
      {showIOSInstall && (
        <div className="w-full max-w-xs space-y-3">
          <Button
            variant="primary"
            onClick={() => setShowIOSModal(true)}
            maxWidth="200px"
          >
            Install instructions (iOS)
          </Button>
        </div>
      )}

      {/* iOS modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/5"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-subheading mb-4">Install on iPhone</h3>

            <div className="space-y-3 text-body">
              <p>
                1. Open this page in <strong>Safari</strong>
              </p>

              <p>
                2. Tap the{" "}
                <Share className="inline h-4 w-4 text-blue-500 mx-1" />{" "}
                <strong>Share</strong> button
              </p>

              <p>
                3. Tap <strong>&quot;Add to Home Screen&quot;</strong>
              </p>

              <p className="text-sm opacity-70">
                After installing, open the app from your Home Screen.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="primary" onClick={() => setShowIOSModal(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
