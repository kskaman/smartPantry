import { SignInButton } from "@/app/components/SignInButton";
import InstallPWA from "./InstallPWA";

export default function SignInPage() {
  return (
    <div className="main-page">
      <div className="w-full max-w-md -mt-4 flex items-center justify-center flex-col">
        <div className="text-center">
          <p className="text-body" style={{ color: "var(--text-muted)" }}>
            Track your pantry, reduce waste, cook what you have
          </p>
        </div>

        <SignInButton />

        <InstallPWA />
      </div>
    </div>
  );
}
