# Eden PWA - Quick Start Instructions

## ✅ What's Done

1. **Landing Site Created** (`landing-site/`)

   - Device detection (mobile/tablet/desktop)
   - Install prompts for mobile devices
   - Desktop message

2. **PWA Configured** (`web-frontend/`)

   - Manifest file
   - Service worker setup
   - Meta tags for iOS

3. **Backend Kept** (`backend/`)
   - No changes needed

## 🚀 What You Need to Do Now

### Step 1: Create App Icons (5 minutes)

**Option A: Use an online tool**

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo (at least 512x512px)
3. Download the zip file
4. Extract icons to `web-frontend/public/icons/`

**Option B: Use a design tool**
Create these sizes manually:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Step 2: Update Landing Page URL

Edit `landing-site/app/page.tsx` line 52:

```typescript
// Change this:
window.location.href = "https://app.yoursite.com";

// To your actual URL:
window.location.href = "http://localhost:3000"; // For testing
// OR
window.location.href = "https://app.eden.com"; // For production
```

### Step 3: Test Locally

**Terminal 1 - Start PWA:**

```bash
cd web-frontend
npm run dev
```

(Should run on http://localhost:3000)

**Terminal 2 - Start Landing Site:**

```bash
cd landing-site
npm run dev
```

(Should run on http://localhost:3001)

### Step 4: Test on Mobile

**For quick testing, use ngrok:**

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000
```

Then visit the ngrok URL on your phone.

## 📱 How It Works

### User Flow:

1. User visits landing site (yoursite.com)
2. Landing detects if mobile/tablet
3. Mobile/tablet users see "Install App" button
4. Desktop users see "Visit on mobile" message
5. After install, PWA opens
6. User signs in with Google
7. User uses the app (inventory, recipes, etc.)

### Deployment Flow:

```
yoursite.com          → landing-site/
app.yoursite.com      → web-frontend/ (PWA)
api.yoursite.com      → backend/ (optional subdomain)
```

## 🎨 Customization

### Change App Name

Edit `web-frontend/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "YourApp"
}
```

### Change Theme Color

Edit `web-frontend/public/manifest.json`:

```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

Also update `web-frontend/app/layout.tsx`:

```tsx
<meta name="theme-color" content="#your-color" />
```

### Change Landing Page Colors

Edit `landing-site/app/page.tsx` - look for Tailwind classes like:

- `from-emerald-500` → your brand color
- `to-teal-600` → your accent color

## 🐛 Troubleshooting

**PWA not installing?**

- Ensure HTTPS in production
- Check manifest.json is valid
- Look for errors in browser console

**Service worker not working?**

- Clear browser cache
- Rebuild the app: `npm run build`
- Check `public/sw.js` exists after build

**Icons not showing?**

- Verify all icon files exist
- Check manifest.json paths
- Clear cache and reinstall

**Landing page not detecting device?**

- Check browser console for errors
- Test on actual device (not desktop dev tools)

## 📦 Build for Production

```bash
# Build PWA
cd web-frontend
npm run build
npm start

# Build Landing Site
cd landing-site
npm run build
npm start
```

## 🚀 Deployment Options

**Vercel (Recommended):**

1. Push to GitHub
2. Import both projects in Vercel
3. Set up domains:
   - Project 1: yoursite.com → landing-site
   - Project 2: app.yoursite.com → web-frontend

**Netlify:**

1. Similar process to Vercel
2. Deploy both folders separately
3. Configure domains

**Your Own Server:**

1. Build both projects
2. Serve with nginx/apache
3. Configure SSL (required for PWA)

## ✨ Next Features to Add

- [ ] Push notifications
- [ ] Background sync
- [ ] Offline data caching
- [ ] Install prompt timing
- [ ] App shortcuts
- [ ] Share target API

## 📞 Need Help?

Common issues:

1. **Icons missing**: Follow Step 1 above
2. **Can't test on phone**: Use ngrok (Step 4)
3. **Service worker errors**: Rebuild the project
4. **Install prompt not showing**: Check HTTPS and manifest

---

**Ready to test?** Run both dev servers and visit the landing site!
