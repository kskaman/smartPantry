# NextAuth.js Authentication Flow - Step by Step Guide

## Table of Contents

1. [How Authentication Works](#how-authentication-works)
2. [The Login Flow](#the-login-flow)
3. [JWT Tokens and Cookies](#jwt-tokens-and-cookies)
4. [Using Sessions in Your App](#using-sessions-in-your-app)
5. [Protected Routes](#protected-routes)
6. [Making Authenticated API Requests](#making-authenticated-api-requests)
7. [Logout Flow](#logout-flow)

## How Authentication Works

Your app uses **NextAuth.js** to handle authentication with Google OAuth. Here's the basic concept:

1. User logs in with Google
2. NextAuth creates a secure **JWT token** and stores it in an **HTTP-only cookie**
3. Every time the browser makes a request, the cookie is automatically sent to the server
4. The server validates the token and returns user information
5. Your components use this user information to display data or restrict access

### Key Components

| Component           | Purpose                              | Location                                     |
| ------------------- | ------------------------------------ | -------------------------------------------- |
| **route.ts**        | NextAuth configuration & OAuth setup | `app/api/auth/[...nextauth]/route.ts`        |
| **auth.ts**         | Proxy to access authentication       | `web-frontend/auth.ts`                       |
| **SignInButton**    | Triggers Google login                | `app/components/SignInButton.tsx`            |
| **DashboardLayout** | Protects `/dashboard` routes         | `app/dashboard/layout.tsx`                   |
| **SignOutButton**   | Triggers logout                      | `app/dashboard/components/SignOutButton.tsx` |

## The Login Flow

### Step 1: User Clicks Sign In Button

```typescript
// app/components/SignInButton.tsx
import { signIn } from "@/app/api/auth/[...nextauth]/route";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
```

When user clicks the button:

- A server action runs (because of `"use server"`)
- `signIn("google")` tells NextAuth to start Google OAuth
- `redirectTo: "/dashboard"` means redirect to dashboard after successful login

### Step 2: Redirect to Google Login

NextAuth automatically redirects user to Google's login page. User enters email and password.

### Step 3: Google Returns Authorization Code

Google redirects back to your app with an authorization code.

NextAuth exchanges this code for:

- User ID
- User email
- User name
- User profile picture

### Step 4: JWT Token is Created

NextAuth creates a JWT token (encrypted) containing user information:

```javascript
// What's inside the token (decoded):
{
  id: "google_user_123",
  email: "user@gmail.com",
  name: "John Doe",
  iat: 1702800000,      // Token created time
  exp: 1720380000,      // Token expires in 30 days
}
```

### Step 5: Token Stored in HTTP-Only Cookie

The encrypted token is stored in a **HTTP-only cookie**:

```
Cookie name: authjs.session-token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (encrypted)
```

**Important:** This cookie:

- ✅ Is sent automatically with every request
- ✅ Cannot be read by JavaScript (secure against XSS attacks)
- ✅ Cannot be modified by JavaScript
- ✅ Is encrypted and signed by NextAuth

### Step 6: User Redirected to Dashboard

After successful login, user is redirected to `/dashboard`.

## JWT Tokens and Cookies

### What is a JWT Token?

A JWT token is a digital container with three parts:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
^-- Header          ^-- Payload (user data)    ^-- Signature (verification)
```

The payload contains user information that the server needs:

- **User ID**: Identifies which user this is
- **Email**: User's email address
- **Name**: User's display name
- **Expiration**: When this token expires (30 days in your app)

### What is an HTTP-Only Cookie?

A cookie is a small file stored by the browser. HTTP-only means:

```
✅ Browser automatically includes it in every request
✅ JavaScript code CANNOT read it
✅ JavaScript code CANNOT modify it
✅ More secure than localStorage

Example request:
GET /dashboard
Cookie: authjs.session-token=eyJhbGciOiJIUzI1NiIs...
```

### Why Not Use localStorage?

Some apps store tokens in `localStorage` instead of cookies:

```typescript
// ❌ NOT recommended
localStorage.setItem("token", jwtToken);

// Problems:
// - JavaScript CAN read it (XSS attack can steal token)
// - Must manually add to every API request
// - Token is visible in browser dev tools
// - More complex to manage

// ✅ Your app uses cookies
// - Browser sends automatically
// - JavaScript cannot access
// - More secure
// - Easier to manage
```

## Using Sessions in Your App

### What is a Session?

A session is the user information object you get after NextAuth validates the token:

```typescript
{
  user: {
    id: "google_user_123",
    email: "user@gmail.com",
    name: "John Doe",
    image: "https://..."
  },
  expires: "2025-01-16T10:30:00Z"
}
```

### How to Get a Session

#### In a Server Component (Recommended)

```typescript
// app/dashboard/layout.tsx
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session from token cookie
  const session = await auth();

  // If no session, user is not logged in
  if (!session) {
    redirect("/"); // Send to login page
  }

  // Use session data
  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      {children}
    </div>
  );
}
```

How it works:

1. Browser sends request with HTTP-only cookie
2. Server receives request
3. `await auth()` reads and validates the cookie
4. If valid, returns session object
5. If invalid/missing, session is null

#### In a Server Action

```typescript
// app/dashboard/actions.ts
"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getUserData() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Use session.user.id to fetch user data
  const userId = session.user.id;
  // ... fetch data from database
}
```

#### In a Client Component (Limited)

```typescript
// app/components/UserMenu.tsx
"use client";

import { useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Not logged in</p>;
  }

  return <p>Hi, {session.user.name}</p>;
}
```

**Note:** This only gives you basic user info (name, email). For full security validation, use server components.

## Protected Routes

### What is a Protected Route?

A protected route is one that only logged-in users can access. If a non-logged-in user tries to visit, they're redirected to login.

### Method 1: Protect in Server Component

```typescript
// app/dashboard/layout.tsx
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/"); // Redirect to home if not logged in
  }

  // This code only runs if user is logged in
  return <div>{children}</div>;
}
```

### Method 2: Automatic Protection with authorized Callback

NextAuth has an `authorized` callback in your configuration that runs on every request:

```typescript
// app/api/auth/[...nextauth]/route.ts
async authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard) {
    // If user is on /dashboard and not logged in, deny access
    if (!isLoggedIn) return false;
  }

  return true;
}
```

This callback:

- Runs on every request before the page renders
- Checks if user is logged in
- Checks which route they're accessing
- Returns true (allow) or false (deny)

## Making Authenticated API Requests

### The Problem

When your frontend calls an API route, how does the backend know which user made the request?

**Answer:** The HTTP-only cookie is automatically sent with the request!

### Example: Getting User's Items

#### API Route (Backend)

```typescript
// app/api/items/route.ts
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  // Step 1: Get session from cookie
  const session = await auth();

  // Step 2: Check if user is logged in
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Step 3: Get user's ID from session
  const userId = session.user.id;

  // Step 4: Query database for this user's items
  const items = await database.items.where({ userId }).findMany();

  // Step 5: Return items
  return Response.json(items);
}
```

#### Server Action (Frontend)

```typescript
// app/dashboard/actions.ts
"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getItems() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userId = session.user.id;

  // Fetch from database or API
  const response = await fetch("/api/items", {
    method: "GET",
    // Cookie is sent automatically, no need to add it manually
  });

  return response.json();
}
```

#### Client Component (Frontend)

```typescript
// app/dashboard/components/ItemList.tsx
"use client";

import { getItems } from "../actions";
import { useEffect, useState } from "react";

export function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Step-by-Step: What Happens When Making a Request

```
1. Component calls getItems() (server action)
   ↓
2. Server action calls /api/items
   ↓
3. Browser automatically includes HTTP-only cookie
   POST /api/items
   Cookie: authjs.session-token=eyJ...
   ↓
4. Server receives request
   ├─ Extracts cookie
   ├─ Decrypts JWT token with AUTH_SECRET
   ├─ Validates expiration date
   ├─ Extracts user ID: "google_user_123"
   ↓
5. API route processes request
   ├─ Gets session object
   ├─ Checks if user is authorized
   ├─ Queries database for this user's items
   ↓
6. Server responds with items
   ↓
7. Component displays items
```

## Logout Flow

### Step 1: User Clicks Sign Out Button

```typescript
// app/dashboard/components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </button>
  );
}
```

When user clicks:

- `signOut()` function runs
- `callbackUrl: "/"` means redirect to home page after logout

### Step 2: NextAuth Deletes Cookie

NextAuth:

- Deletes the `authjs.session-token` cookie from the browser
- Clears all session data

### Step 3: User Redirected to Home

Browser redirects to `/` (or callbackUrl you specified).

### Step 4: User is Logged Out

Now when user tries to access `/dashboard`:

- Cookie doesn't exist
- `await auth()` returns null
- User is redirected to login page

## Complete Example: Creating an Item

Let's walk through a complete flow where a logged-in user creates a new item.

### Frontend: User Fills Form

```typescript
// app/dashboard/components/AddItemForm.tsx
"use client";

import { addItem } from "../actions";

export function AddItemForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Call server action
    await addItem({
      name: formData.get("name") as string,
      quantity: formData.get("quantity") as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Item name" />
      <input name="quantity" placeholder="Quantity" />
      <button type="submit">Add Item</button>
    </form>
  );
}
```

### Server Action: Validate and Call API

```typescript
// app/dashboard/actions.ts
"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function addItem(data: { name: string; quantity: string }) {
  // Step 1: Get session
  const session = await auth();

  // Step 2: Check if logged in
  if (!session?.user?.id) {
    throw new Error("You must be logged in");
  }

  // Step 3: Call API route with form data
  const response = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    // Cookie is sent automatically
  });

  return response.json();
}
```

### API Route: Create Item in Database

```typescript
// app/api/items/route.ts
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  // Step 1: Get session from cookie
  const session = await auth();

  // Step 2: Validate user is logged in
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Step 3: Parse request body
  const { name, quantity } = await request.json();

  // Step 4: Create item in database
  const item = await database.items.create({
    name,
    quantity,
    userId: session.user.id, // Associate with this user
  });

  // Step 5: Return created item
  return Response.json(item);
}
```

### Data Flow Summary

```
User fills form
    ↓
Form submitted to server action
    ↓
Server action validates session
    ↓
Server action calls /api/items
    ↓
HTTP-only cookie sent automatically
    ↓
API route receives request
    ↓
API route validates token
    ↓
API route creates item with userId
    ↓
Item saved to database
    ↓
Response sent back to client
    ↓
Component displays success message
```

## Key Concepts Summary

### Session

- User information object returned by `await auth()`
- Contains: user ID, email, name, expiration
- Only available on server-side

### Token

- Encrypted JWT stored in HTTP-only cookie
- Automatically sent with every request
- Server validates token to confirm user identity
- Cannot be read or modified by JavaScript

### Cookie

- HTTP-only cookie is most secure way to store token
- Browser manages it automatically
- Sent with every request, no manual work needed

### Protected Routes

- Use `await auth()` in server components
- Redirect to login if session is null
- Automatically validated before rendering

### API Authentication

- Every API route can call `await auth()` to get user
- Use `session.user.id` to associate data with user
- Cookie is sent automatically, no manual headers needed

## Common Patterns

### Check if User is Logged In (Server Component)

```typescript
const session = await auth();
if (!session) {
  // User is not logged in
}
```

### Get User's ID (Server Side)

```typescript
const session = await auth();
const userId = session?.user?.id;
```

### Create Data Associated with User (API Route)

```typescript
const session = await auth();
const userId = session.user.id;

const item = await database.items.create({
  name: "Item",
  userId: userId, // Link to user
});
```

### Protect a Route (Server Component)

```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const session = await auth();
if (!session) redirect("/");
```

## Troubleshooting

### "Session is null/undefined"

- Make sure you're in a server component or server action
- Cannot use `await auth()` in client components
- Use `useSession()` hook from `next-auth/react` in client components instead

### "Cannot use signIn() in client component"

- `signIn()` from route.ts is server-side only
- Use `signOut()` from `"next-auth/react"` in client components
- Or use a server action

### "API Route Returns 401"

- Check that session is not null
- Verify cookie is being sent
- Make sure AUTH_SECRET is set in .env.local

### "User is Redirected to Login After Every Page Refresh"

- Token may be expired (30 days)
- Or session is invalid
- Check browser cookies to see if authjs.session-token exists

## Environment Variables Needed

In `.env.local`:

```
AUTH_SECRET=your-random-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate AUTH_SECRET:

```bash
openssl rand -base64 32
```

## File Structure

```
web-frontend/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/
│   │       └── route.ts           <- NextAuth configuration
│   ├── components/
│   │   └── SignInButton.tsx       <- Login button
│   ├── dashboard/
│   │   ├── layout.tsx             <- Protected layout
│   │   ├── actions.ts             <- Server actions
│   │   └── components/
│   │       ├── SignOutButton.tsx  <- Logout button
│   │       └── ItemList.tsx       <- Display user data
│   └── page.tsx                   <- Home page
└── auth.ts                        <- Auth proxy
```

This guide covers the essential NextAuth.js flow needed to understand how authentication works in your application.
