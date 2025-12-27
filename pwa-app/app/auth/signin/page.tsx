import { signIn } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
            Eden
          </h1>
          <p className="text-muted-foreground">
            Track your pantry, reduce waste, cook what you have
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="space-y-4">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-base"
                variant="outline"
              >
                Sign in with Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
