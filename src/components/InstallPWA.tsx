"use client";

import { useState } from "react";
import { Download, Share, X, ChefHat } from "lucide-react";
import { Button } from "@/ui/components";
import { usePWAStatus } from "@/hooks/use-pwa-status";

/**
 * A floating install button that appears on dashboard pages
 * for users who haven't installed the PWA yet.
 * The main install flow is on the landing page - this is a reminder.
 */
export default function InstallPWA() {
  const { isStandalone, isIOS, isInstalled, canInstall, promptInstall } = usePWAStatus();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("pwa-install-dismissed") === "true";
  });

  // Handle install button click
  const handleInstallClick = async () => {
    if (canInstall) {
      // Android/Chrome - use the native prompt
      await promptInstall();
    } else if (isIOS) {
      // iOS - show instructions
      setShowIOSPrompt(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const handleIOSPromptClose = () => {
    setShowIOSPrompt(false);
  };

  // Don't show if:
  // - Already installed (running as standalone PWA)
  // - Already marked as installed in localStorage
  // - User dismissed this reminder
  // - Neither canInstall nor iOS (no way to install)
  if (isStandalone || isInstalled || dismissed || (!canInstall && !isIOS)) {
    return null;
  }

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-4 flex items-center gap-2">
        <button
          onClick={handleDismiss}
          className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
        <Button
          variant="primary"
          onClick={handleInstallClick}
          icon={isIOS ? <Share className="h-5 w-5" /> : <Download className="h-5 w-5" />}
        >
          Install App
        </Button>
      </div>

      {/* iOS Installation Instructions Popup */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 md:items-center">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom-4">
            <button
              onClick={handleIOSPromptClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--button-primary-bg)] rounded-xl flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Install Beta
                </h3>
                <p className="text-sm text-gray-500">Add to your home screen</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p>Tap the <Share className="inline h-4 w-4 text-blue-500 mx-1" /> <strong>Share</strong> button in Safari&apos;s toolbar</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p>Tap <strong>&quot;Add&quot;</strong> in the top-right corner</p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleIOSPromptClose}
              className="mt-6 w-full"
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
