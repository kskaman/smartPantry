# Eden PWA Setup Guide

## Project Structure

```
eden/
├── landing-site/          # Landing page for mobile/tablet detection
├── web-frontend/         # PWA app (main application)
└── backend/              # Backend API (receipt scanning, etc.)
```

## What We've Set Up

### 1. **Landing Site** (`landing-site/`)
- **Purpose**: Marketing page that detects device type
- **Features**:
  - ✅ Detects mobile, tablet, desktop
  - ✅ Shows install button for mobile/tablet
  - ✅ Shows message for desktop users to visit on mobile
  - ✅ Browser-specific install instructions (iOS Safari, Android Chrome)

### 2. **PWA App** (`web-frontend/`)
- **Purpose**: Main application (Progressive Web App)
- **Features**:
  - ✅ PWA manifest configured
  - ✅ Service worker support (via next-pwa)
  - ✅ Apple touch icons
  - ✅ Theme color meta tags
  - ✅ Offline capability ready
  - ✅ Google OAuth authentication
  - ✅ All existing features (inventory, recipes, etc.)

### 3. **Backend** (`backend/`)
- **Purpose**: API services (unchanged)
- **Features**:
  - Receipt scanning
  - Additional API endpoints

## Next Steps

### 1. Create App Icons

You need to create icon files in `web-frontend/public/icons/`:

| Size | Filename | Purpose |
|------|----------|---------|
| 72x72 | icon-72x72.png | Small devices |
| 96x96 | icon-96x96.png | Small devices |
| 128x128 | icon-128x128.png | Medium devices |
| 144x144 | icon-144x144.png | Medium devices |
| 152x152 | icon-152x152.png | iOS |
| 192x192 | icon-192x192.png | Standard |
| 384x384 | icon-384x384.png | Large |
| 512x512 | icon-512x512.png | Splash screens |

**Quick way to create icons:**
- Use [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- Upload a 512x512 logo
- Download all sizes

### 2. Update Configuration

In `landing-site/app/page.tsx`, change this line:
```typescript
window.location.href = "https://app.yoursite.com";
```
To your actual PWA URL (e.g., `https://app.eden.com` or `http://localhost:3000` for testing)

### 3. Test the PWA

**Development:**
```bash
# Terminal 1 - Run PWA app
cd web-frontend
npm run dev

# Terminal 2 - Run landing site
cd landing-site
npm run dev
```

**Testing on Mobile:**
1. Use [ngrok](https://ngrok.com/) to expose localhost
2. Or deploy to Vercel/Netlify for quick testing

### 4. Deployment Strategy

**Option A: Single Domain**
```
yoursite.com          → landing-site
app.yoursite.com      → web-frontend (PWA)
api.yoursite.com      → backend
```

**Option B: Separate Domains**
```
yoursite.com          → landing-site
eden-app.com          → web-frontend (PWA)
api.eden-app.com      → backend
```

### 5. PWA Installation Testing

**On Android (Chrome):**
1. Visit the PWA URL
2. Chrome will show "Install app" banner
3. Or tap menu → "Install app"

**On iOS (Safari):**
1. Visit the PWA URL
2. Tap Share button
3. Tap "Add to Home Screen"

**On Desktop (Chrome):**
1. Visit the PWA URL
2. Look for install icon in address bar
3. Or go to menu → "Install Eden"

## Configuration Files

### `web-frontend/public/manifest.json`
- ✅ App name, colors, icons configured
- ✅ Display mode set to "standalone"
- ✅ Orientation set to "portrait"

### `web-frontend/next.config.ts`
- ✅ PWA plugin configured
- ✅ Service worker generation enabled
- ✅ Disabled in development mode

### `web-frontend/app/layout.tsx`
- ✅ Manifest link added
- ✅ Apple touch icon configured
- ✅ Theme color meta tag added

## Important Notes

1. **HTTPS Required**: PWAs require HTTPS in production (localhost works without)
2. **Service Worker**: Will be auto-generated on build
3. **Offline Support**: Currently basic - can be enhanced
4. **Push Notifications**: Can be added later if needed
5. **Desktop Users**: Landing site shows message to use mobile device

## Development Workflow

1. Develop features in `web-frontend/`
2. Test PWA locally with dev tools
3. Deploy landing site to main domain
4. Deploy PWA to subdomain
5. Users visit landing → install PWA

## Testing Checklist

- [ ] Icons display correctly
- [ ] App installs on Android
- [ ] App installs on iOS
- [ ] Offline mode works (basic)
- [ ] Google Sign-in works in PWA
- [ ] Landing page detects device type
- [ ] Desktop users see correct message
- [ ] Install prompts work

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Next PWA Docs](https://github.com/shadowwalker/next-pwa)
- [Manifest Generator](https://www.simicart.com/manifest-generator.html/)

## Support

- PWA support: All modern browsers
- iOS: Safari 11.3+
- Android: Chrome, Firefox, Edge
- Desktop: Chrome, Edge, Safari (macOS)
