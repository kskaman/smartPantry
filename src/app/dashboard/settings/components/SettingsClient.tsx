"use client";

import { Card, TextInput } from "@/ui/components";

interface SettingsClientProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Account Information */}
      <Card>
        <div className="flex flex-col gap-4">
          <h2 
            className="text-lg font-semibold"
            style={{ color: 'var(--text-title)' }}
          >
            Account Information
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TextInput
                type="text"
                value={user.name || ""}
                disabled
                label="Name"
                placeholder="Your name"
              />
              <p 
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Managed by your Google account
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <TextInput
                type="email"
                value={user.email || ""}
                disabled
                label="Email"
                placeholder="Your email"
              />
              <p 
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Managed by your Google account
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
