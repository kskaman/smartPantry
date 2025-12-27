import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { createServerClient } from "@/lib/supabase/server";
import { UserSettingsUpdate } from "@/types/settings";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" - we'll create default settings
      console.error("Error fetching settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    // If no settings exist, return defaults
    if (!data) {
      return NextResponse.json({
        user_id: session.user.id,
        expiry_alert_days: 2,
        email_notifications: true,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UserSettingsUpdate = await request.json();

    const supabase = await createServerClient();

    // Check if settings exist
    const { data: existing } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    let result;

    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from("user_settings")
        .update(body)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
          { error: "Failed to update settings" },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("user_settings")
        .insert([
          {
            user_id: session.user.id,
            expiry_alert_days: body.expiry_alert_days ?? 2,
            email_notifications: body.email_notifications ?? true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating settings:", error);
        return NextResponse.json(
          { error: "Failed to create settings" },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

