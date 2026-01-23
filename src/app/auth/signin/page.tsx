import { SignInButton } from "@/app/components/SignInButton";
import InstallPWA from "../../components/InstallPWA";

export default function SignInPage() {
  return (
    <div className="main-page min-h-0">
      <div className="w-full max-w-md flex items-center gap-4 justify-center items-center flex-col">
        <div className="text-center">
          <p className="text-body" style={{ color: "var(--text-muted)" }}>
            Track your pantry, reduce waste, cook what you have
          </p>
        </div>
        <InstallPWA />
        <SignInButton />
      </div>
    </div>
  );
}
