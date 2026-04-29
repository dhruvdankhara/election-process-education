"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Election = {
  id: string;
  title: string;
  country: string;
  state: string;
  type: string;
  description: string;
};

const emptyElection = {
  title: "",
  country: "India",
  state: "",
  type: "assembly",
  description: "",
};

export default function AdminElectionsPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [form, setForm] = useState(emptyElection);

  const load = async () => {
    const response = await fetch("/api/v1/admin/elections");
    if (!response.ok) return;
    const payload = (await response.json()) as { data: Election[] };
    setElections(payload.data ?? []);
  };

  useEffect(() => {
    fetch("/api/v1/admin/elections")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!payload) return;
        const result = payload as { data: Election[] };
        setElections(result.data ?? []);
      });
  }, []);

  const createElection = async () => {
    const response = await fetch("/api/v1/admin/elections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) return;
    setForm(emptyElection);
    load();
  };

  const deleteElection = async (id: string) => {
    const response = await fetch(`/api/v1/admin/elections/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    load();
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Manage elections</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create election</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Election title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Input
            placeholder="State"
            value={form.state}
            onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
          />
          <Input
            placeholder="Type"
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
          />
          <Input
            placeholder="Country"
            value={form.country}
            onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="md:col-span-2"
          />
          <Button onClick={createElection} className="md:col-span-2">
            Create election
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{election.title}</p>
                <p className="text-sm text-muted-foreground">
                  {election.state}, {election.country} · {election.type}
                </p>
              </div>
              <Button variant="destructive" onClick={() => deleteElection(election.id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
