"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download, Share, ExternalLink, Smartphone, X, ChefHat } from "lucide-react";
import { Button } from "@/ui/components";
import { usePWAStatus } from "@/hooks/use-pwa-status";

export default function LandingPage() {
  const router = useRouter();
  const { 
    isStandalone, 
    isIOS, 
    isInstalled, 
    canInstall, 
    promptInstall,
    isInBrowser 
  } = usePWAStatus();
  
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [dismissedOpenInApp, setDismissedOpenInApp] = useState(false);
  
  // Compute whether to show open in app modal
  const showOpenInAppModal = useMemo(() => {
    return isInstalled && isInBrowser && !isStandalone && !dismissedOpenInApp;
  }, [isInstalled, isInBrowser, isStandalone, dismissedOpenInApp]);

  // If running as standalone PWA, redirect to auth
  useEffect(() => {
    if (isStandalone) {
      router.replace("/auth/signin");
    }
  }, [isStandalone, router]);

  // Handle install button click
  const handleInstall = async () => {
    if (canInstall) {
      // Android/Chrome - use the native prompt
      const installed = await promptInstall();
      if (installed) {
        router.replace("/auth/signin");
      }
    } else if (isIOS) {
      // iOS - show instructions
      setShowIOSInstructions(true);
    }
  };

  // Handle "Continue in Browser" - for users who want to use browser
  const handleContinueInBrowser = () => {
    setDismissedOpenInApp(true);
    router.push("/auth/signin");
  };

  // Handle "Open App" button
  const handleOpenApp = () => {
    // Attempt to open the PWA
    // On Android, this will try to open the installed PWA
    // The PWA should register to handle its own URL
    window.location.href = window.location.origin + "/dashboard/home";
  };

  // iOS instructions modal
  const handleIOSInstructionsDone = () => {
    setShowIOSInstructions(false);
    // Mark as "pending install" - user saw instructions
    // They'll need to actually add to home screen
    // We'll check standalone mode on next visit
  };

  // If standalone, we're redirecting - show loading
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[var(--main-page-bg)] flex items-center justify-center">
        <div className="animate-pulse">
          <ChefHat className="h-16 w-16 text-[var(--button-primary-bg)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--main-page-bg)] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-[var(--button-primary-bg)] rounded-3xl flex items-center justify-center shadow-lg">
            <ChefHat className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Beta
        </h1>
        <p className="text-[var(--text-muted)] text-center max-w-xs mb-8">
          Track your pantry, reduce waste, and discover recipes with what you have
        </p>

        {/* Install Button - Show if NOT installed */}
        {!isInstalled && (
          <div className="w-full max-w-xs space-y-4">
            <Button
              variant="primary"
              onClick={handleInstall}
              className="w-full"
              icon={isIOS ? <Share className="h-5 w-5" /> : <Download className="h-5 w-5" />}
            >
              {isIOS ? "Install App" : "Install App"}
            </Button>
            
            <p className="text-xs text-center text-[var(--text-muted)]">
              {isIOS 
                ? "Tap to see how to add to your home screen" 
                : "Install for the best experience"
              }
            </p>

            {/* Skip install link */}
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              Continue in browser instead
            </button>
          </div>
        )}

        {/* If installed but in browser - show open app prompt */}
        {isInstalled && isInBrowser && (
          <div className="w-full max-w-xs space-y-4">
            <Button
              variant="primary"
              onClick={handleOpenApp}
              className="w-full"
              icon={<ExternalLink className="h-5 w-5" />}
            >
              Open in App
            </Button>
            
            <button
              onClick={handleContinueInBrowser}
              className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              Continue in browser instead
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-[var(--card-bg)] rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Track Inventory</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-[var(--card-bg)] rounded-xl flex items-center justify-center">
              <span className="text-2xl">🍳</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Find Recipes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-[var(--card-bg)] rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Reduce Waste</p>
          </div>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 md:items-center">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom-4">
            <button
              onClick={() => setShowIOSInstructions(false)}
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

            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                onClick={handleIOSInstructionsDone}
                className="w-full"
              >
                I&apos;ve Added It
              </Button>
              <button
                onClick={() => {
                  setShowIOSInstructions(false);
                  router.push("/auth/signin");
                }}
                className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
              >
                Continue in browser instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Open in App" Modal - for when app is installed but user is in browser */}
      {showOpenInAppModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--button-primary-bg)] rounded-2xl flex items-center justify-center">
                <Smartphone className="h-9 w-9 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                App Already Installed
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                For the best experience, open Beta in the installed app
              </p>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={handleOpenApp}
                  className="w-full"
                  icon={<ExternalLink className="h-5 w-5" />}
                >
                  Open in App
                </Button>
                
                <button
                  onClick={handleContinueInBrowser}
                  className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
                >
                  Continue in browser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
