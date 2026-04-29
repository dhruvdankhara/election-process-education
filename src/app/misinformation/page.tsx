"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type CheckResult = {
  verdict: "true" | "false" | "uncertain";
  confidence: number;
  explanation: string;
};

export default function MisinformationPage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async () => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/v1/ai/misinformation/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      setError("Unable to verify this claim right now.");
      setLoading(false);
      return;
    }

    const payload = (await response.json()) as { data: CheckResult };
    setResult(payload.data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Misinformation detector</h1>
        <p className="mt-2 text-muted-foreground">
          Paste election-related claims and get a verification-oriented guidance response.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyze a message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Paste social message or claim to verify..."
            rows={6}
            aria-label="Claim to verify"
          />
          <Button onClick={verify} disabled={loading || content.trim().length < 5}>
            {loading ? "Checking..." : "Verify claim"}
          </Button>
        </CardContent>
      </Card>

      <div aria-live="polite" aria-atomic="true">
        {error && (
          <Card className="border-red-300">
            <CardContent className="py-4 text-sm text-red-600">{error}</CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Verification result</CardTitle>
              <Badge variant="secondary">{result.verdict.toUpperCase()}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
              <p>{result.explanation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
