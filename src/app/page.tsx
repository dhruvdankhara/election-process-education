import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    "Personalized learning journey",
    "Election timeline and deadline tracker",
    "Context-aware election assistant chat",
    "Step-by-step voting simulation",
    "Misinformation verification",
    "Multilingual and voice-ready guidance",
  ];

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Learn the election process clearly, confidently, and step by step.
        </h1>
        <p className="max-w-3xl text-lg text-slate-600">
          VoteWise Guide combines AI learning paths, timeline intelligence, and interactive practice
          so first-time and returning voters can act on the right steps at the right time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">Start onboarding</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign in with Google</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/timeline">Explore timelines</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature}>
            <CardHeader>
              <CardTitle className="text-base">{feature}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Built to make election awareness practical and accessible.
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
