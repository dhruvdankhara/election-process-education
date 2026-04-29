"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface JourneyStep {
  order: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface LearningJourneyData {
  id?: string;
  title: string;
  description: string;
  difficulty?: string;
  steps: JourneyStep[];
}

type UserProfile = {
  age: number;
  isFirstTimeVoter: boolean;
  location: string;
  preferredLanguage?: string;
  voiceEnabled?: boolean;
};

export default function LearningPage() {
  const [journeys, setJourneys] = useState<LearningJourneyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const activeJourney = useMemo(() => journeys[0] ?? null, [journeys]);

  useEffect(() => {
    const loadJourneys = async () => {
      setLoading(true);
      setError(null);
      try {
        const [response, profileResponse] = await Promise.all([
          fetch("/api/v1/learning-journey"),
          fetch("/api/v1/users/profile"),
        ]);
        if (!response.ok) throw new Error("Could not load learning journeys");
        const result = (await response.json()) as {
          data: LearningJourneyData[];
        };
        setJourneys(result.data ?? []);
        if (profileResponse.ok) {
          const profileResult = (await profileResponse.json()) as {
            data?: UserProfile;
          };
          setProfile(profileResult.data ?? null);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load journeys");
      } finally {
        setLoading(false);
      }
    };

    loadJourneys();
  }, []);

  const generateJourney = async () => {
    setGenerating(true);
    setError(null);
    try {
      const profileRes = await fetch("/api/v1/users/profile");
      const profileJson = (await profileRes.json()) as {
        data?: UserProfile;
      };
      const fallbackProfile: UserProfile = {
        age: 19,
        isFirstTimeVoter: true,
        location: "Delhi",
        preferredLanguage: "en",
      };
      const selectedProfile = profileJson.data ?? fallbackProfile;

      const res = await fetch("/api/v1/learning-journey/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProfile),
      });
      if (!res.ok) throw new Error("Failed to generate journey");
      const data = (await res.json()) as { data: LearningJourneyData };
      setJourneys((prev) => [data.data, ...prev.filter((item) => item.id !== data.data.id)]);
    } catch (generationError) {
      setError(
        generationError instanceof Error ? generationError.message : "Failed to generate journey"
      );
    } finally {
      setGenerating(false);
    }
  };

  const readJourneyAloud = () => {
    if (!activeJourney || !profile?.voiceEnabled || typeof window === "undefined") {
      return;
    }

    const utteranceText = `${activeJourney.title}. ${activeJourney.description}. ${activeJourney.steps
      .map((step) => `Step ${step.order}: ${step.title}. ${step.description}`)
      .join(" ")}`;
    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.lang = profile.preferredLanguage === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const markComplete = async (journeyId: string, order: number) => {
    const response = await fetch(`/api/v1/learning-journey/${journeyId}/steps/${order}`, {
      method: "PATCH",
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { data: LearningJourneyData };
    setJourneys((prev) =>
      prev.map((journey) => (journey.id === journeyId ? payload.data : journey))
    );
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl space-y-8">
      <div className="flex justify-between items-center bg-zinc-50 p-6 rounded-lg border">
        <div>
          <h1 className="text-2xl font-bold">Your Learning Journey</h1>
          <p className="text-gray-600 mt-2">
            Get an AI-curated step-by-step path to understanding how to vote.
          </p>
        </div>
        <Button disabled={generating} onClick={generateJourney}>
          {generating ? "Generating..." : "Generate Custom Path"}
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Loading your journeys...
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-300">
          <CardContent className="py-4 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {activeJourney && (
        <Card className="my-8">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>{activeJourney.title}</CardTitle>
                <CardDescription>{activeJourney.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {activeJourney.difficulty && (
                  <Badge variant="secondary">{activeJourney.difficulty}</Badge>
                )}
                {profile?.voiceEnabled && (
                  <Button size="sm" variant="outline" onClick={readJourneyAloud}>
                    Read aloud
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={
                (activeJourney.steps.filter((step) => step.isCompleted).length /
                  Math.max(activeJourney.steps.length, 1)) *
                100
              }
            />
            {activeJourney.steps.map((step) => (
              <div
                key={step.order}
                className="border p-4 rounded bg-white shadow-sm flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full font-bold">
                  {step.order}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                <Button
                  variant={step.isCompleted ? "outline" : "default"}
                  onClick={() =>
                    activeJourney.id && !step.isCompleted
                      ? markComplete(activeJourney.id, step.order)
                      : undefined
                  }
                  disabled={!activeJourney.id || step.isCompleted}
                >
                  {step.isCompleted ? "Reviewed" : "Mark as Done"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && journeys.length === 0 && (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            No journey found yet. Generate your first personalized learning path.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
