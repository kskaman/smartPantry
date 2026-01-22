import LandingPage from "./landing/page";

// The main entry point now shows the landing page
// which handles PWA install prompts, "open in app" prompts,
// and redirects appropriately based on installation status
export default function HomePage() {
  return <LandingPage />;
}
