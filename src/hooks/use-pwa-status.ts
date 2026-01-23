"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface PWAStatus {
  // Whether the app is running as installed PWA (standalone mode)
  isStandalone: boolean;
  // Whether this is an iOS device
  isIOS: boolean;
  // Whether the app has been installed (tracked via localStorage)
  isInstalled: boolean;
  // Whether we can show the install prompt (Android/Chrome)
  canInstall: boolean;
  // The deferred install prompt
  deferredPrompt: BeforeInstallPromptEvent | null;
  // Trigger the install prompt (Android/Chrome)
  promptInstall: () => Promise<boolean>;
  // Mark the app as installed (for tracking purposes)
  markAsInstalled: () => void;
  // Check if running in browser (not standalone)
  isInBrowser: boolean;
}

const INSTALL_KEY = "beta-pwa-installed";

// Helper functions for SSR-safe checks
function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as NavigatorStandalone).standalone === true
  );
}

function getIsIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  );
}

function getIsInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(INSTALL_KEY) === "true" || getIsStandalone();
}

// Subscribe to storage changes
function subscribeToStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePWAStatus(): PWAStatus {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Use useSyncExternalStore for localStorage to avoid hydration issues
  const isInstalled = useSyncExternalStore(
    subscribeToStorage,
    getIsInstalled,
    getServerSnapshot,
  );

  // These are computed values
  const isStandalone =
    typeof window !== "undefined" ? getIsStandalone() : false;
  const isIOS = typeof window !== "undefined" ? getIsIOS() : false;
  const isInBrowser = typeof window !== "undefined" && !isStandalone;

  // Mark as installed if running in standalone mode
  useEffect(() => {
    if (getIsStandalone() && typeof window !== "undefined") {
      const stored = localStorage.getItem(INSTALL_KEY);
      if (stored !== "true") {
        localStorage.setItem(INSTALL_KEY, "true");
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event("storage"));
      }
    }
  }, []);

  // Listen for beforeinstallprompt event (Android/Chrome/Edge)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      localStorage.setItem(INSTALL_KEY, "true");
      window.dispatchEvent(new Event("storage"));
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // Trigger the install prompt
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      localStorage.setItem(INSTALL_KEY, "true");
      window.dispatchEvent(new Event("storage"));
      setDeferredPrompt(null);
      return true;
    }

    return false;
  }, [deferredPrompt]);

  // Mark app as installed manually (for iOS flow)
  const markAsInstalled = useCallback(() => {
    localStorage.setItem(INSTALL_KEY, "true");
    window.dispatchEvent(new Event("storage"));
  }, []);

  return {
    isStandalone,
    isIOS,
    isInstalled,
    canInstall: !!deferredPrompt,
    deferredPrompt,
    promptInstall,
    markAsInstalled,
    isInBrowser,
  };
}

// Helper to generate the app open URL
export function getAppOpenURL(): string {
  if (typeof window === "undefined") return "/";
  return window.location.origin + "/dashboard/home";
}

// Check if we should show "Open in App" prompt
export function shouldShowOpenInApp(
  isInstalled: boolean,
  isInBrowser: boolean,
): boolean {
  return isInstalled && isInBrowser;
}
