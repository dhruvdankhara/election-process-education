import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/core/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { electionDataService } from "@/modules/election/service/election-data.service";
import { UserRepository } from "@/modules/user/repository/user.repository";

const userRepository = new UserRepository();

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const [elections, users, logs] = await Promise.all([
    electionDataService.listElections(),
    userRepository.listAllUsers(),
    electionDataService.listAdminLogs(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage elections, timelines, and system activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{users.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total elections</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{elections.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Admin logs</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{logs.length}</CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Button asChild variant="outline">
          <Link href="/admin/elections">Manage elections</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/timelines">Manage timelines</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/logs">View logs</Link>
        </Button>
      </div>
    </div>
  );
}
