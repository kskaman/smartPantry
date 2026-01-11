import { getCurrentUser } from "@/lib/auth";
import { SettingsClient } from "./components/SettingsClient";

export default async function SettingsPage() {
  // Middleware already protects this route, just get user data
  const user = await getCurrentUser();

  if (!user) {
    return null; // Should never happen due to middleware
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <h1 className="text-title">Settings</h1>
        <p 
          className="text-small"
          style={{ color: 'var(--text-secondary)' }}
        >
          Manage your account and preferences
        </p>
      </div>

      <SettingsClient
        user={{
          name: user.user_metadata?.name || null,
          email: user.email || null,
          image: user.user_metadata?.avatar_url || null,
        }}
      />
    </div>
  );
}
