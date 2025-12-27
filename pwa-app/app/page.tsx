import { SignInButton } from "./components/SignInButton";
import { Plus, TrendingUp, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="
      absolute inset-0 -z-10
      bg-(--bg)"
      />

      <header className="section-shell flex items-center justify-end w-full py-6">
        <div>
          <SignInButton />
        </div>
      </header>

      <main className="section-shell flex flex-col gap-20 pb-24 pt-10">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              Smarter groceries. Less waste.
            </Badge>
            <h1 className="text-display">
              Track your pantry, reduce waste, cook what you have.
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Eden keeps your household inventory up to date - scan receipts or
              add items manually. Track what&apos;s expiring, get recipe
              suggestions, and know what to buy next.
            </p>
            <div className="flex flex-wrap gap-3">
              <SignInButton />
            </div>
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Expiry alerts</p>
                  <p className="text-xl font-semibold mt-2">Get notified</p>
                  <p className="text-muted-foreground text-sm">
                    Alerted 2 days in advance
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Recipe suggestions
                  </p>
                  <p className="text-xl font-semibold mt-2">Smart matches</p>
                  <p className="text-muted-foreground text-sm">
                    Based on what you own
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-6 -top-6 h-32 rounded-3xl bg-gradient-to-r from-blue-100 via-cyan-50 to-amber-50 blur-3xl" />
            <Card className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="outline">Household overview</Badge>
                  <span className="text-sm text-muted-foreground">
                    Real-time sync
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">Fridge</p>
                    <p className="text-2xl font-semibold">—</p>
                    <p className="text-sm text-muted-foreground">items</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">Pantry</p>
                    <p className="text-2xl font-semibold">—</p>
                    <p className="text-sm text-muted-foreground">items</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">Freezer</p>
                    <p className="text-2xl font-semibold">—</p>
                    <p className="text-sm text-muted-foreground">items</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center rounded-lg bg-muted/50 px-3 py-4">
                    <p className="text-sm text-muted-foreground">
                      Sign in to see your inventory
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="scroll-mt-20">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              How it works
            </Badge>
            <h2 className="text-2xl font-semibold mt-4">
              Simple workflow, powerful results
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Add items via receipt scan or manual entry, then get smart
              insights
            </p>
          </div>

          <div className="relative">
            {/* Connection lines for desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
              {[
                {
                  step: "1",
                  title: "Add items",
                  desc: "Scan receipts with OCR for automatic extraction, or manually add items with quantities, expiry dates, and locations. Update amounts anytime.",
                  icon: <Plus className="h-6 w-6" />,
                  bgColor: "bg-blue-100",
                  badgeColor: "bg-blue-600",
                },
                {
                  step: "2",
                  title: "Track & manage",
                  desc: "View your inventory by location (fridge, pantry, freezer), adjust quantities as you use items, and see expiry dates at a glance.",
                  icon: <TrendingUp className="h-6 w-6" />,
                  bgColor: "bg-green-100",
                  badgeColor: "bg-green-600",
                },
                {
                  step: "3",
                  title: "Get smart insights",
                  desc: "Receive expiry alerts, recipe suggestions based on what you have, and shopping reminders for items running low.",
                  icon: <Lightbulb className="h-6 w-6" />,
                  bgColor: "bg-orange-100",
                  badgeColor: "bg-orange-600",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <Card className="flex flex-col gap-4 text-center lg:text-left">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bgColor}`}
                        >
                          {item.icon}
                        </div>
                        <div
                          className={`hidden lg:flex h-8 w-8 items-center justify-center rounded-full ${item.badgeColor} text-sm font-bold text-white`}
                        >
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground mt-2">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Step number badge for mobile */}
                  <div
                    className={`lg:hidden absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full ${item.badgeColor} text-sm font-bold text-white shadow-lg`}
                  >
                    {item.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
