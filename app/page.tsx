import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardPenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const priorities = [
  "Track company-level momentum",
  "Centralize update submissions",
  "Review executive portfolio signals",
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-6 py-8">
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Executive portfolio operations
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              A simple command center for portfolio updates and performance
              signals.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Capture structured updates from portfolio companies and give
              leadership a clean view of the metrics that matter.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/admin/submit">
                  <ClipboardPenLine className="h-4 w-4" />
                  Submit Portfolio Update
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">
                  <BarChart3 className="h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardDescription>Current operating focus</CardDescription>
              <CardTitle>Portfolio intelligence snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Companies</p>
                  <p className="mt-2 text-3xl font-semibold">24</p>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Updates due</p>
                  <p className="mt-2 text-3xl font-semibold">7</p>
                </div>
              </div>
              <div className="space-y-3">
                {priorities.map((priority) => (
                  <div
                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                    key={priority}
                  >
                    <span>{priority}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
