# Database Schema & Authentication Flow

## Project: Recipe & Inventory Management System

**Database Provider:** Supabase (PostgreSQL)  
**Authentication:** NextAuth with Google OAuth (No Database Storage)  
**Last Updated:** December 16, 2025

## Authentication Flow (Step-by-Step)

### **Step 1: User Signs In with Google**

```
User clicks "Sign in with Google"
              ↓
NextAuth redirects to Google OAuth
              ↓
Google asks user to authenticate
              ↓
Google returns: user.id, user.email, user.name
              ↓
NextAuth JWT Callback is triggered
```

### **Step 2: JWT Token Created (In Memory)**

```typescript
// NextAuth JWT Callback - Creates a token with user info
async jwt({ token, user, account }) {
  if (user) {
    token.id = user.id || account?.providerAccountId || user.email;
    token.email = user.email;
    token.name = user.name;
  }
  return token; // <- Token stored in JWT (not in database)
}
```

### **Step 3: Session Created (Stateless JWT)**

```typescript
// NextAuth Session Callback - Extracts token into session
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id;           // ← ID from JWT
    session.user.email = token.email;     // ← Email from JWT
    session.user.name = token.name;       // ← Name from JWT
  }
  return session;
}
```

### **Step 4: User Accesses Dashboard**

```
Frontend requests protected route (/dashboard)
              ↓
Middleware checks if session exists
              ↓
If authenticated -> Allow access
If not -> Redirect to login page
```

## **Do We Need to Store User in Database?**

### **Current Setup: NO DATABASE STORAGE**

- User info comes from Google (or JWT token)
- Session is **stateless JWT** (expires in 30 days)
- No user table needed for authentication

### **Where User Info Comes From:**

```
┌─────────────────────┐
│   Google OAuth      │
├─────────────────────┤
│ • user.id           │
│ • user.email        │
│ • user.name         │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   NextAuth JWT      │  ← Stored in JWT token (encrypted)
├─────────────────────┤
│ • token.id          │
│ • token.email       │
│ • token.name        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Session Object    │  ← Available to frontend/backend
├─────────────────────┤
│ • session.user.id   │
│ • session.user.email│
│ • session.user.name │
└─────────────────────┘
```

## **How to Access User Info in Your App**

### **In Frontend (Client Component):**

```typescript
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session } = useSession();

  return (
    <div>
      <p>Email: {session?.user?.email}</p>
      <p>Name: {session?.user?.name}</p>
      <p>ID: {session?.user?.id}</p>
    </div>
  );
}
```

### **In Frontend (Server Component):**

```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function Dashboard() {
  const session = await auth();

  return (
    <div>
      <p>Email: {session?.user?.email}</p>
      <p>Name: {session?.user?.name}</p>
      <p>ID: {session?.user?.id}</p>
    </div>
  );
}
```

### **In Backend API Routes:**

```typescript
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id; // ← Use this for all queries
  const userEmail = session.user.email;

  // Example: Get user's items from Supabase
  const response = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId); // ← Filter by user_id from session

  return Response.json(response.data);
}
```

---

## **🔑 How NextAuth Handles Tokens & Backend Communication**

### **IMPORTANT: You Don't Manually Send Tokens!**

NextAuth **automatically** handles token sending. Here's how:

```
Step 1: User Logs In
  ↓
Step 2: NextAuth creates JWT token
  ↓
Step 3: Token stored in HTTP-Only Cookie (automatic)
  ↓
Step 4: Browser sends cookie with EVERY request (automatic)
  ↓
Step 5: Backend validates token from cookie (automatic)
```

### **The Magic: You Just Use `await auth()`**

```typescript
// Backend Route (Next.js API Route)
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  // NextAuth automatically:
  // 1. Reads the cookie from the request
  // 2. Validates the JWT token inside it
  // 3. Returns the session if valid

  const session = await auth(); // ← That's it!

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Now you have user info WITHOUT manually sending token
  return Response.json({ userId: session.user.id });
}
```

---

## **📊 Complete Flow Diagram**

```
FRONTEND (Next.js)
├─ User clicks "Sign in with Google"
└─ SignInButton → signIn('google')
         ↓

NEXTAUTH HANDLES OAUTH
├─ Redirects to Google
├─ Google authenticates user
├─ Google returns user info
└─ NextAuth creates JWT
         ↓

TOKEN STORAGE (Automatic)
├─ JWT token created
├─ Stored in HTTP-Only Cookie
│  (Name: next-auth.session-token)
└─ Cookie set for domain
         ↓

FRONTEND MAKES REQUEST
├─ fetch('/api/items')
├─ Browser automatically includes cookie
│  (Cookie: next-auth.session-token=xyz...)
└─ Request sent to backend
         ↓

BACKEND RECEIVES REQUEST
├─ Middleware/Route handler runs
├─ Calls: const session = await auth()
├─ NextAuth reads cookie from request
├─ Validates JWT token
├─ Returns session if valid
└─ You get: session.user.id, session.user.email
         ↓

RESPONSE
└─ Backend queries database filtered by user_id
```

---

## **🎯 Real Example: Frontend to Backend**

### **Frontend (Client)**

```typescript
// This is what you write in frontend
async function getMyItems() {
  const response = await fetch("/api/items");
  const items = await response.json();
  return items;
}
```

**Behind the scenes:**

- Browser automatically adds: `Cookie: next-auth.session-token=...`

### **Backend (Server)**

```typescript
// backend/api/items/route.ts (or in Express)
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  // NextAuth reads the cookie from request
  // Validates the JWT token
  // Returns session with user info
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // User is authenticated - use their ID
  const userId = session.user.id;

  // Query database
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId);

  return Response.json(items);
}
```

---

## **❓ Common Confusion: "Do I need to manually send token?"**

### **NO - NextAuth handles everything**

```typescript
// ❌ DON'T DO THIS
const token = getToken(); // ← Don't manually manage tokens
fetch("/api/items", {
  headers: { Authorization: `Bearer ${token}` },
});

// ✅ DO THIS
fetch("/api/items"); // ← Just fetch normally!
// NextAuth sends cookie automatically
```

---

## **🔐 Token Flow in Detail**

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHAT HAPPENS BEHIND SCENES                   │
└─────────────────────────────────────────────────────────────────┘

1. USER LOGS IN
   User → Google Auth → Redirects to: /api/auth/callback/google
                              ↓
                        NextAuth receives OAuth code
                        Exchanges code for user info
                        Creates JWT: eyJhbGc...xyz

2. JWT STORED IN COOKIE
   NextAuth sets HTTP-Only Cookie:
   Set-Cookie: next-auth.session-token=eyJhbGc...xyz;
               HttpOnly; Secure; SameSite=Lax; Path=/

3. FRONTEND MAKES REQUEST
   GET /api/items HTTP/1.1
   Host: localhost:3000
   Cookie: next-auth.session-token=eyJhbGc...xyz

4. BACKEND RECEIVES REQUEST
   Request object has the cookie
   await auth() reads and validates it
   Returns: { user: { id, email, name, image } }

5. BACKEND RESPONSE
   Response: [{ id: 1, name: "Chicken", user_id: "123" }, ...]
```

---

## **📝 How It Works with Your Express Backend**

If you have a separate **Express backend**:

```typescript
// Express backend (separate from Next.js)
import express from "express";

const app = express();

// You CANNOT use await auth() in Express
// Because auth() is Next.js specific

// Instead: Validate token manually

import { jwtVerify } from "jose";

app.get("/api/items", async (req, res) => {
  // Get token from cookie or header
  const token = req.cookies["next-auth.session-token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validate JWT
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
  const verified = await jwtVerify(token, secret);
  const userId = verified.payload.sub; // ← User ID

  // Query database
  const items = await supabase.from("items").select("*").eq("user_id", userId);

  res.json(items);
});
```

---

## **✅ Your Setup (Next.js + Express Backend)**

```
FRONTEND (Next.js)
  ↓
NextAuth (in Next.js)
  ├─ Handles Google OAuth
  ├─ Creates JWT token
  └─ Stores in HTTP-Only Cookie
  ↓
FRONTEND REQUESTS BACKEND
  GET /api/items
  Cookie: next-auth.session-token=...
  ↓
BACKEND (Express)
  ├─ Receives request with cookie
  ├─ Reads token from cookie
  ├─ Validates JWT (using AUTH_SECRET)
  ├─ Extracts user_id
  └─ Queries database filtered by user_id
  ↓
RESPONSE
  ← Returns user's items
```

---

## ** Summary: Token Flow**

| Step | Who      | What                                     |
| ---- | -------- | ---------------------------------------- |
| 1    | NextAuth | Creates JWT token from Google OAuth      |
| 2    | NextAuth | Stores token in HTTP-Only Cookie         |
| 3    | Browser  | Automatically sends cookie with requests |
| 4    | Backend  | Reads cookie from request                |
| 5    | Backend  | Validates JWT token                      |
| 6    | Backend  | Extracts user_id from token              |
| 7    | Backend  | Queries database using user_id           |
| 8    | Backend  | Returns filtered results                 |

**You don't manually send tokens - NextAuth handles it!** ✅
