import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubmitPage() {
  return (
    <PageShell
      eyebrow="Portfolio update"
      title="Submit portfolio update"
      description="A lightweight intake form for the core details leadership needs each reporting cycle."
      action={
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardDescription>Update details</CardDescription>
          <CardTitle>Company report</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="companyName">
                Company name
              </label>
              <input
                className="h-11 rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                id="companyName"
                name="companyName"
                placeholder="Acme Ventures"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="reportingPeriod">
                Reporting period
              </label>
              <input
                className="h-11 rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                id="reportingPeriod"
                name="reportingPeriod"
                placeholder="Q2 2026"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="summary">
                Executive summary
              </label>
              <textarea
                className="min-h-32 rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                id="summary"
                name="summary"
                placeholder="Key wins, risks, asks, and next milestones."
              />
            </div>
            <Button className="w-full sm:w-fit" type="submit">
              Submit update
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
