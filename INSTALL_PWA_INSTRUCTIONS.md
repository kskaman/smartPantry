# PWA Installation Instructions

## For Your Landing Page

To add an "Install App" button to your landing page (separate repo), follow these steps:

### 1. Add the Install Button Component

```typescript
'use client'; // If using Next.js App Router

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User installed the app');
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstall}
      className="your-button-styles"
    >
      Install Eden App
    </button>
  );
}
```

### 2. Important Notes

#### Cross-Origin PWA Installation

- The PWA must be **on the same domain** as your landing page OR
- Your landing page can link to the PWA app URL, which will trigger the install prompt when users visit

#### Recommended Approach for Separate Landing Page:

**Option A: Same Domain Deployment**

- Deploy landing page at: `https://yourdomain.com`
- Deploy PWA app at: `https://yourdomain.com/app` or subdomain `https://app.yourdomain.com`
- This allows both pages to share the install prompt

**Option B: Redirect to App (Recommended for Different Domains)**

- Landing page: `https://landing.yourdomain.com`
- PWA app: `https://app.yourdomain.com`
- Add a "Get Started" or "Launch App" button that redirects to the PWA
- The install prompt will appear when users visit the PWA URL (not on landing page)

**Option C: Use Deep Linking**

- Link from landing page to PWA with special parameter
- Example: `https://app.yourdomain.com?ref=landing`
- PWA can show custom install UI based on the ref parameter

### 3. Example Landing Page Button (For Same Domain Setup)

```tsx
// In your landing page component
import InstallPWAButton from "./InstallPWAButton";

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Eden</h1>
      <p>Track your pantry, reduce waste, cook what you have</p>

      {/* Install button - only shows if PWA is installable */}
      <InstallPWAButton />

      {/* Fallback: Always-visible button */}
      <a
        href="https://your-pwa-url.com/dashboard/home"
        className="button-primary"
      >
        Open App
      </a>
    </div>
  );
}
```

### 4. For Different Domains

If your landing page is on a completely different domain, you cannot trigger the PWA install prompt from there. Instead:

```tsx
export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Eden</h1>
      <p>Track your pantry, reduce waste, cook what you have</p>

      {/* Direct link to PWA - install prompt will show there */}
      <a
        href="https://your-pwa-url.com/dashboard/home"
        className="button-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        Launch App
        <span className="badge">Installable</span>
      </a>

      <p className="text-small">
        App can be installed to your home screen after opening
      </p>
    </div>
  );
}
```

## PWA Requirements Checklist

Your app already has:

- ✅ HTTPS (required for PWA)
- ✅ Web App Manifest (`/manifest.json`)
- ✅ Service Worker (via @ducanh2912/next-pwa)
- ✅ Mobile-responsive design
- ✅ Metadata and theme colors

### Additional Requirements:

- ⚠️ **Icons needed** - Create and add PWA icons to `/public/icons/` folder
- ⚠️ **Test on mobile** - Install prompt only shows on mobile Chrome/Edge

## Creating PWA Icons

Generate icons in these sizes:

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512 (also used as maskable icon)

Place them in: `public/icons/icon-[size].png`

You can use tools like:

- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/
- Photoshop/Figma with export presets

## Testing PWA Installation

### Desktop (Chrome/Edge):

1. Open your app URL
2. Look for install icon in address bar (⊕ or computer icon)
3. Click to install

### Mobile (Chrome/Safari):

1. Open your app URL
2. Chrome: "Add to Home screen" from menu
3. Safari: Share → "Add to Home Screen"

### Verify Installation:

- Check Chrome DevTools → Application → Manifest
- Check Service Worker registration
- Check installability criteria

## Production Deployment

Make sure:

1. App is served over HTTPS
2. Manifest is accessible at `/manifest.json`
3. Service worker is registered
4. Icons are properly sized and accessible
5. Start URL is correct (currently set to `/dashboard/home`)

## Current PWA Setup

Your app uses:

- **PWA Library**: `@ducanh2912/next-pwa` v10.2.9
- **Config**: `next.config.ts` with PWA wrapper
- **Disabled in dev**: PWA only works in production build
- **Build command**: `npm run build && npm start`

To test PWA locally:

```bash
npm run build
npm start
# Then visit http://localhost:3000
```
