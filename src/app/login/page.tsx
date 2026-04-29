import { signIn } from "@/core/auth/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-gray-500">
            Choose a method to continue learning about the election process.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" className="w-full">
            Log in with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
