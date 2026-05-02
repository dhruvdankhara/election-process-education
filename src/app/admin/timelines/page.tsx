"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Election = { id: string; title: string };
type Timeline = {
  id: string;
  title: string;
  description: string;
  events: {
    id: string;
    title: string;
    date: string;
    type: string;
    importance: string;
  }[];
};

export default function AdminTimelinesPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [timelineForm, setTimelineForm] = useState({
    title: "",
    description: "",
    isDummy: false,
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "registration",
    importance: "medium",
  });

  const activeTimeline = useMemo(() => timelines[0] ?? null, [timelines]);

  const loadTimelines = async (electionId: string) => {
    if (!electionId) return;
    const response = await fetch(`/api/v1/timelines/${electionId}`);
    if (!response.ok) return;
    const payload = (await response.json()) as { data: Timeline[] };
    setTimelines(payload.data ?? []);
  };

  useEffect(() => {
    fetch("/api/v1/admin/elections")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!payload) return;
        const result = payload as { data: Election[] };
        setElections(result.data ?? []);
        if (result.data?.[0]?.id) {
          setSelectedElectionId((current) => current || result.data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedElectionId) return;
    fetch(`/api/v1/timelines/${selectedElectionId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!payload) return;
        const result = payload as { data: Timeline[] };
        setTimelines(result.data ?? []);
      });
  }, [selectedElectionId]);

  const createTimeline = async () => {
    if (!selectedElectionId) return;
    const response = await fetch(`/api/v1/admin/timelines/${selectedElectionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timelineForm),
    });
    if (!response.ok) return;
    setTimelineForm({ title: "", description: "", isDummy: false });
    loadTimelines(selectedElectionId);
  };

  const addEvent = async () => {
    if (!activeTimeline?.id) return;
    const response = await fetch(
      `/api/v1/admin/timelines/by-timeline/${activeTimeline.id}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      }
    );
    if (!response.ok) return;
    setEventForm({
      title: "",
      description: "",
      date: "",
      type: "registration",
      importance: "medium",
    });
    loadTimelines(selectedElectionId);
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Manage timelines</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Election</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {elections.map((election) => (
            <Button
              key={election.id}
              variant={selectedElectionId === election.id ? "default" : "outline"}
              onClick={() => setSelectedElectionId(election.id)}
            >
              {election.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create timeline</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            aria-label="Timeline title"
            placeholder="Timeline title"
            value={timelineForm.title}
            onChange={(event) =>
              setTimelineForm((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
          />
          <Input
            aria-label="Description"
            placeholder="Description"
            value={timelineForm.description}
            onChange={(event) =>
              setTimelineForm((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
          <Button onClick={createTimeline} className="md:col-span-2">
            Create timeline
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add timeline event</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            aria-label="Event title"
            placeholder="Event title"
            value={eventForm.title}
            onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Input
            aria-label="Event description"
            placeholder="Event description"
            value={eventForm.description}
            onChange={(event) =>
              setEventForm((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
          <Input
            aria-label="Event date"
            type="date"
            value={eventForm.date}
            onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
          />
          <Input
            aria-label="Type"
            placeholder="Type"
            value={eventForm.type}
            onChange={(event) => setEventForm((prev) => ({ ...prev, type: event.target.value }))}
          />
          <Input
            aria-label="Importance"
            placeholder="Importance"
            value={eventForm.importance}
            onChange={(event) =>
              setEventForm((prev) => ({
                ...prev,
                importance: event.target.value,
              }))
            }
          />
          <Button onClick={addEvent}>Add event to first timeline</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {timelines.map((timeline) => (
          <Card key={timeline.id}>
            <CardHeader>
              <CardTitle className="text-base">{timeline.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{timeline.description}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {timeline.events.map((event) => (
                  <li key={event.id}>
                    {event.date} · {event.title} ({event.importance})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
