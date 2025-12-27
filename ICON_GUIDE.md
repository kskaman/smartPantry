# Icon Generation Guide

Since you need icons for your PWA, here are your options:

## Option 1: Use PWA Builder (Easiest)
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 logo
3. Download all sizes
4. Extract to `web-frontend/public/icons/`

## Option 2: Use Figma/Photoshop
Create these sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Option 3: Use ImageMagick (Command Line)

If you have a logo file, run these commands:

```bash
# Install ImageMagick first
# Windows: https://imagemagick.org/script/download.php
# Mac: brew install imagemagick

cd web-frontend/public/icons

# Generate all sizes from your logo
magick convert your-logo.png -resize 72x72 icon-72x72.png
magick convert your-logo.png -resize 96x96 icon-96x96.png
magick convert your-logo.png -resize 128x128 icon-128x128.png
magick convert your-logo.png -resize 144x144 icon-144x144.png
magick convert your-logo.png -resize 152x152 icon-152x152.png
magick convert your-logo.png -resize 192x192 icon-192x192.png
magick convert your-logo.png -resize 384x384 icon-384x384.png
magick convert your-logo.png -resize 512x512 icon-512x512.png
```

## Option 4: Placeholder Icons (For Testing)

For now, you can use a simple colored square as placeholder:

1. Go to https://via.placeholder.com/
2. Download these:
   - https://via.placeholder.com/72/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/96/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/128/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/144/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/152/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/192/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/384/10b981/FFFFFF?text=Eden
   - https://via.placeholder.com/512/10b981/FFFFFF?text=Eden

3. Rename them to the correct filenames
4. Save to `web-frontend/public/icons/`

## Recommended: Professional Icon Design

For a real app, consider:
- Hiring a designer on Fiverr ($5-50)
- Using Canva Pro templates
- Creating in Figma (free)

## What Makes a Good PWA Icon?

✅ Simple and recognizable
✅ Works at small sizes
✅ Solid background (no transparency for splash screens)
✅ Clear contrast
✅ Represents your brand

❌ Avoid text that's too small
❌ Avoid complex details
❌ Avoid thin lines
