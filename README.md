# Smart Pantry

Smart Pantry is a full-stack Progressive Web App for managing household food inventory, tracking expiry dates, and discovering recipes based on ingredients already available at home.

The goal is simple: help users keep track of their food and use ingredients before they expire.

## Team

Smart Pantry was developed collaboratively by:

- **Kamanpreet Singh** — [GitHub](https://github.com/kskaman)
- **Raghul Suraj** — GitHub profile

  
## Features

### Food Inventory Management

- Add, edit, and delete food items
- Track quantity, unit, purchase date, and expiry date
- Search inventory items by name
- Filter items by expiry status:
  - Fresh
  - Expiring soon
  - Expired
- Delete multiple inventory items
- View inventory statistics from the dashboard

### Expiry Tracking

Smart Pantry automatically classifies food based on its expiry date.

Items can be identified as:

- Expired
- Expiring today
- Expiring within 2 days
- Expiring within 7 days
- Fresh

The dashboard displays counts for total, fresh, expiring-soon, and expired inventory items.

### Recipe Suggestions

Smart Pantry suggests recipes based on the ingredients in the user's current inventory.

The recommendation logic gives higher priority to recipes that use ingredients approaching their expiry dates.

Recipe ranking considers:

- Number of inventory ingredients matched
- Number of expiring ingredients used
- How soon those ingredients expire
- Percentage of recipe ingredients already available
- Number of ingredients still missing

Recipes that use more urgent ingredients receive a higher score.

Recipe information is retrieved from TheMealDB API.

Users can also:

- Search recipe suggestions
- Browse paginated recipe results
- View recipe details
- Save recipes for later

### Authentication

Authentication is handled with Supabase Auth.

Dashboard routes are protected and require an authenticated session.

User-specific inventory data is isolated using Supabase/PostgreSQL Row Level Security so users only access their own data.

### Progressive Web App

Smart Pantry includes PWA support and can be installed on supported mobile and desktop devices.

PWA functionality includes:

- Installable standalone application
- Web app manifest
- Service worker registration
- Mobile-friendly interface
- Install prompt handling
- iOS installation detection

### Receipt Camera

The application includes a receipt scanning interface that can:

- Access the device camera
- Prefer the rear camera on mobile devices
- Capture a receipt image
- Preview the captured image
- Retake the image

Receipt OCR and automatic item extraction are planned features and are not currently implemented.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- Lucide React

### Backend

- Next.js API Routes
- Supabase
- PostgreSQL

### Authentication

- Supabase Auth
- Server-side session handling
- Protected dashboard routes

### External APIs

- TheMealDB

### PWA

- `@ducanh2912/next-pwa`
- Web App Manifest
- Service Worker

## Architecture

The project uses the Next.js App Router.

```text
src/
├── app/
│   ├── api/
│   │   ├── items/
│   │   └── recipes/
│   ├── auth/
│   └── dashboard/
│       ├── home/
│       ├── inventory/
│       ├── recipes/
│       └── settings/
├── hooks/
├── lib/
├── providers/
├── types/
└── ui/
