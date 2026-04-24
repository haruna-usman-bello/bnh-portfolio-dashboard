import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const companies = [
  { name: "Atlas Health", stage: "Series A", revenue: "$1.8M", status: "On track" },
  { name: "LedgerGrid", stage: "Seed", revenue: "$640K", status: "Watch" },
  { name: "Northstar AI", stage: "Series B", revenue: "$5.2M", status: "Ahead" },
];

export default function DashboardPage() {
  return (
    <PageShell
      eyebrow="Executive dashboard"
      title="Portfolio overview"
      description="A clean starting point for reviewing submitted updates and portfolio-level signals."
      action={
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total portfolio value" value="$128.4M" detail="+8.2% quarter over quarter" />
        <MetricCard label="Runway average" value="18 mo" detail="Across reporting companies" />
        <MetricCard label="Updates received" value="17 / 24" detail="Current reporting cycle" />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardDescription>Company performance</CardDescription>
            <CardTitle>Latest portfolio updates</CardTitle>
          </div>
          <Badge variant="secondary">
            <TrendingUp className="h-3.5 w-3.5" />
            Sample data
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-card">
                {companies.map((company) => (
                  <tr key={company.name}>
                    <td className="px-4 py-3 font-medium">{company.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{company.stage}</td>
                    <td className="px-4 py-3 text-muted-foreground">{company.revenue}</td>
                    <td className="px-4 py-3">
                      <Badge variant={company.status === "Watch" ? "outline" : "secondary"}>
                        {company.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
