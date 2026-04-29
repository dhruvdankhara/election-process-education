import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileRepository } from "@/modules/user/repository/profile.repository";
import { ProgressRepository } from "@/modules/progress/repository/progress.repository";
import { electionDataService } from "@/modules/election/service/election-data.service";

const profileRepository = new UserProfileRepository();
const progressRepository = new ProgressRepository();

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [profile, progressRows, elections] = await Promise.all([
    profileRepository.findByUserId(session.user.id),
    progressRepository.listByUserId(session.user.id),
    electionDataService.listElections(),
  ]);

  const overallProgress =
    progressRows.length === 0
      ? 0
      : Math.round(
          progressRows.reduce((sum, row) => sum + row.percentage, 0) / progressRows.length
        );

  return (
    <div className="container mx-auto max-w-5xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {session.user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            {profile
              ? `Profile set for ${profile.location}. Continue your election preparation.`
              : "Complete your profile and start a personalized election learning journey."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/profile">Edit Profile</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall completion across active journeys
            </p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/learning">Continue Learning</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{elections.length} elections</div>
            <p className="text-xs text-muted-foreground mt-1">Check critical dates</p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/timeline">View Timelines</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Chat Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
            <p className="text-xs text-muted-foreground mt-1">Have doubts? Ask now.</p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/chat">Open Chat</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Simulation Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground mt-1">Practice the process now</p>
            <Button asChild className="w-full mt-4" variant="secondary">
              <Link href="/simulation">Start Simulation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Misinformation detector</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verify election-related claims before sharing.
            </p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link href="/misinformation">Verify a claim</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Timeline readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review upcoming deadlines and important actions.
            </p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link href="/timeline">Open timeline</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
