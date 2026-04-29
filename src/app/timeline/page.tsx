"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type Election = {
  id: string;
  title: string;
  state: string;
};

type Timeline = {
  id: string;
  title: string;
  description: string;
  events: {
    id: string;
    title: string;
    description: string;
    date: string;
    importance: string;
    type: string;
  }[];
};

export default function TimelinePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>("");
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadElections = async () => {
      const response = await fetch("/api/v1/elections");
      if (!response.ok) {
        setError("Unable to load elections");
        return;
      }
      const data = (await response.json()) as { data: Election[] };
      setElections(data.data ?? []);
      if (data.data?.[0]?.id) {
        setSelectedElection(data.data[0].id);
      }
    };

    loadElections();
  }, []);

  useEffect(() => {
    const loadTimeline = async () => {
      if (!selectedElection) return;

      const response = await fetch(`/api/v1/timelines/${selectedElection}`);
      if (!response.ok) {
        setError("Unable to load timeline");
        return;
      }
      const payload = (await response.json()) as { data: Timeline[] };
      const firstTimeline = payload.data?.[0] ?? null;
      setTimeline(firstTimeline);

      if (firstTimeline) {
        const summaryResponse = await fetch("/api/v1/ai/timeline/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ electionId: selectedElection }),
        });
        if (summaryResponse.ok) {
          const summaryPayload = (await summaryResponse.json()) as {
            data: { description: string };
          };
          setSummary(summaryPayload.data.description);
        }
      }
    };

    loadTimeline();
  }, [selectedElection]);

  const orderedEvents = useMemo(
    () =>
      [...(timeline?.events ?? [])].sort((a, b) =>
        a.date < b.date ? -1 : a.date > b.date ? 1 : 0
      ),
    [timeline]
  );

  return (
    <div className="container mx-auto p-8 max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Election Timeline</h1>
        <p className="text-muted-foreground mt-2">
          Track important dates and know exactly when you need to act.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select election</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {elections.map((election) => (
            <Button
              key={election.id}
              variant={selectedElection === election.id ? "default" : "outline"}
              onClick={() => setSelectedElection(election.id)}
              aria-pressed={selectedElection === election.id}
            >
              {election.title} ({election.state})
            </Button>
          ))}
        </CardContent>
      </Card>

      <div aria-live="polite" aria-atomic="false">
        {summary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">AI timeline summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-300 mb-8">
            <CardContent className="py-4 text-sm text-red-600">{error}</CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {orderedEvents.map((event) => (
            <Card key={event.id} className="relative">
              <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg bg-blue-500"></div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{event.title}</span>
                  <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {format(new Date(event.date), "dd MMM yyyy")}
                  </span>
                </CardTitle>
                <CardDescription>{event.type.toUpperCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
              </CardContent>
            </Card>
          ))}

          {!error && orderedEvents.length === 0 && (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                No timeline events found for the selected election.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
