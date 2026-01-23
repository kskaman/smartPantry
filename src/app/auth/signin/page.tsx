import { SignInButton } from "@/app/components/SignInButton";

export default function SignInPage() {
  return (
    <div className="main-page">
      <div className="w-full max-w-md h-dvh flex items-center justify-center flex-col">
        <div className="text-center mb-8">
          <p className="text-body" style={{ color: "var(--text-muted)" }}>
            Track your pantry, reduce waste, cook what you have
          </p>
        </div>

        <SignInButton />
      </div>
    </div>
  );
}
