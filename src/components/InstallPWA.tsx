"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/ui/components";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Is the app already running as an installed PWA?
  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
  });

  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Don't show if already in standalone OR if we don't have the prompt
  if (isStandalone || !showInstallButton) return null;

  return (
    <Button
      variant="primary"
      onClick={handleInstallClick}
      icon={<Download className="h-5 w-5" />}
    >
      Install App
    </Button>
  );
}
