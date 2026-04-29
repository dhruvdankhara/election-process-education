"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminLog = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/v1/admin/logs");
      if (!response.ok) return;
      const payload = (await response.json()) as { data: AdminLog[] };
      setLogs(payload.data ?? []);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Admin activity logs</h1>

      {logs.length === 0 && (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            No admin activity recorded yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader>
              <CardTitle className="text-base">{log.action}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>Target: {log.targetType}</p>
              <p>ID: {log.targetId}</p>
              <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
