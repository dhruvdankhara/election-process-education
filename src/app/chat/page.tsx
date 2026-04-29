"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    {
      role: "ai",
      content:
        "Hi! I'm your Election Assistant. Ask me anything about voter registration, documents, or polling booths!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: messages.slice(-6).map((item) => ({
            role: item.role === "ai" ? "assistant" : "user",
            message: item.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to get assistant response");
      }

      const payload = (await res.json()) as { data?: { reply?: string } };
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            payload.data?.reply ??
            "I could not answer that clearly. Please try again with more context.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Chat is temporarily unavailable. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 h-screen flex flex-col">
      <Card className="flex-1 flex flex-col h-full">
        <CardHeader>
          <CardTitle>Election Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-full w-full pr-4 space-y-4">
            <div aria-live="polite" aria-atomic="false">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[80%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={sendMessage} className="w-full flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              aria-label="Your message"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "..." : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
