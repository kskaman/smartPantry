import { signIn } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <Button type="submit">Sign in with Google</Button>
    </form>
  );
}
