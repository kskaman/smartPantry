import { auth } from "@/app/api/auth/[...nextauth]/route";
import { SettingsClient } from "./components/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="section-shell py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <SettingsClient
        user={{
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
        }}
      />
    </div>
  );
}
