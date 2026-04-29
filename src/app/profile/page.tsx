"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Profile = {
  age: number;
  isFirstTimeVoter: boolean;
  location: string;
  preferredLanguage: string;
  voiceEnabled: boolean;
};

export default function ProfilePage() {
  const [form, setForm] = useState<Profile>({
    age: 18,
    isFirstTimeVoter: true,
    location: "",
    preferredLanguage: "en",
    voiceEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/v1/users/profile");
      if (response.ok) {
        const payload = (await response.json()) as { data: Profile | null };
        if (payload.data) setForm(payload.data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const response = await fetch("/api/v1/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      setMessage("Profile saved successfully.");
    } else {
      setMessage("Unable to save profile at the moment.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Loading profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Profile and preferences</h1>
        <p className="mt-2 text-muted-foreground">
          Update your voter profile to keep guidance and timelines personalized.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={form.age}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, age: Number(event.target.value) }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3 rounded border p-3">
            <Checkbox
              id="first-time"
              checked={form.isFirstTimeVoter}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isFirstTimeVoter: checked === true }))
              }
            />
            <Label htmlFor="first-time">I am a first-time voter</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Preferred language</Label>
            <select
              id="language"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={form.preferredLanguage}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, preferredLanguage: event.target.value }))
              }
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>
          </div>
          <div className="flex items-center gap-3 rounded border p-3">
            <Checkbox
              id="voice"
              checked={form.voiceEnabled}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, voiceEnabled: checked === true }))
              }
            />
            <Label htmlFor="voice">Enable voice assistant</Label>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
