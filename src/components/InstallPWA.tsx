"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/ui/components";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Extend Navigator interface for iOS standalone property
interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  
  // Initialize states with proper checks to avoid cascading renders
  const [isIOS] = useState(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua);
  });

  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorStandalone).standalone === true
    );
  });

  const [showInstallButton, setShowInstallButton] = useState(() => {
    if (typeof window === "undefined") return false;
    
    // For iOS: Check if user has dismissed the prompt before
    const iosPromptDismissed = localStorage.getItem(
      "iosInstallPromptDismissed",
    );
    
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorStandalone).standalone === true;

    // Show for iOS if: iOS device, not installed, not previously dismissed
    return iOS && !standalone && !iosPromptDismissed;
  });

  useEffect(() => {
    // Android/Desktop Chrome: Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    };

    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // Handle Android/Chrome install
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome install
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } else if (isIOS) {
      // iOS: Show instructions popup
      setShowIOSPrompt(true);
    }
  };

  const handleIOSPromptClose = () => {
    setShowIOSPrompt(false);
    // Remember that user dismissed it (optional: remove to show every time)
    localStorage.setItem("iosInstallPromptDismissed", "true");
    setShowInstallButton(false);
  };

  // Don't show if already installed
  if (isStandalone || !showInstallButton) return null;

  return (
    <>
      {/* Install Button */}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
        <Button
          variant="primary"
          onClick={handleInstallClick}
          icon={<Download className="h-5 w-5" />}
        >
          Install App
        </Button>
      </div>

      {/* iOS Installation Instructions Popup */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 md:items-center">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={handleIOSPromptClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Install Beta App
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <p>To install this app on your iPhone:</p>

              <ol className="space-y-2 pl-4 list-decimal">
                <li className="flex items-start gap-2">
                  Tap the <Share className="inline h-4 w-4 text-blue-500" />{" "}
                  <strong>Share</strong> button in your Safari toolbar
                </li>
                <li>
                  Scroll down and tap <strong>Add to Home Screen</strong>
                </li>
                <li>
                  Tap <strong>Add</strong> in the top-right corner
                </li>
              </ol>

              <p className="pt-2 text-xs text-gray-500">
                The app will appear on your home screen like a native app.
              </p>
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
