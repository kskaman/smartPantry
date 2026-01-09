"use client";

import { useState, useEffect } from "react";
import { UserSettings } from "@/types/settings";
import { CheckCircle } from "lucide-react";
import { Button } from "@/ui/components";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SettingsClientProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        expiry_alert_days: parseInt(
          formData.get("expiry_alert_days") as string
        ),
        email_notifications: formData.get("email_notifications") === "on",
      };

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save settings");
      }

      const data = await response.json();
      setSettings(data);
      setSaved(true);
      toast.success("Settings saved successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
      toast.error(
        err instanceof Error ? err.message : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={user.name || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Managed by your Google account
            </p>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={user.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Managed by your Google account
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle className="h-5 w-5" />
                Settings saved successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="expiry_alert_days">Expiry Alert Days</Label>
              <Input
                type="number"
                id="expiry_alert_days"
                name="expiry_alert_days"
                min="1"
                max="30"
                defaultValue={settings?.expiry_alert_days ?? 2}
                required
              />
              <p className="text-xs text-muted-foreground">
                Get notified this many days before items expire
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="email_notifications"
                name="email_notifications"
                defaultChecked={settings?.email_notifications ?? true}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="email_notifications" className="font-medium">
                Email Notifications
              </Label>
            </div>
            <p className="text-xs text-muted-foreground -mt-2 ml-7">
              Receive email alerts for expiring items
            </p>

            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
