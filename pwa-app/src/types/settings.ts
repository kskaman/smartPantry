export interface UserSettings {
  id: string;
  user_id: string;
  expiry_alert_days: number;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsUpdate {
  expiry_alert_days?: number;
  email_notifications?: boolean;
}

