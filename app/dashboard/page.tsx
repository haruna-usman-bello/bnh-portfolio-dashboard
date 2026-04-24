import Link from "next/link";
import { ArrowLeft, Eye, Plus } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RagStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type DashboardPageProps = {
  searchParams: Promise<{
    submitted?: string;
  }>;
};

const ngnFormatter = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  maximumFractionDigits: 0,
  style: "currency",
});

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

function formatNgn(value: unknown) {
  return ngnFormatter.format(Number(value));
}

function formatMonth(value: Date) {
  return monthFormatter.format(value);
}

function ragBadgeClassName(status: RagStatus) {
  if (status === RagStatus.GREEN) {
    return "border-green-700/20 bg-green-50 text-green-800";
  }

  if (status === RagStatus.AMBER) {
    return "border-amber-700/20 bg-amber-50 text-amber-800";
  }

  return "border-red-700/20 bg-red-50 text-red-800";
}

function ragLabel(status: RagStatus) {
  if (status === RagStatus.GREEN) {
    return "Green";
  }

  if (status === RagStatus.AMBER) {
    return "Amber";
  }

  return "Red";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { submitted } = await searchParams;
  const portfolioUpdates = await prisma.portfolioUpdate.findMany({
    include: {
      kpis: true,
    },
    orderBy: [
      { reportingMonth: "desc" },
      { portfolioName: "asc" },
    ],
  });

  const totalCashPosition = portfolioUpdates.reduce(
    (total, update) => total + Number(update.cashPositionNgn),
    0,
  );
  const greenCount = portfolioUpdates.filter(
    (update) => update.ragStatus === RagStatus.GREEN,
  ).length;
  const amberCount = portfolioUpdates.filter(
    (update) => update.ragStatus === RagStatus.AMBER,
  ).length;
  const redCount = portfolioUpdates.filter(
    (update) => update.ragStatus === RagStatus.RED,
  ).length;

  return (
    <PageShell
      eyebrow="Chief of Staff dashboard"
      title="Portfolio intelligence"
      description="A concise operating view of monthly portfolio submissions, cash position, and execution risk."
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/submit">
              <Plus className="h-4 w-4" />
              New update
            </Link>
          </Button>
        </div>
      }
    >
      {submitted === "1" ? (
        <div className="rounded-md border border-green-700/20 bg-green-50 px-4 py-3 text-sm text-green-800">
          Portfolio update submitted successfully.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          detail="Submitted monthly updates"
          label="Total portfolios"
          value={String(portfolioUpdates.length)}
        />
        <MetricCard
          detail="Aggregate current cash"
          label="Total cash position"
          value={formatNgn(totalCashPosition)}
        />
        <MetricCard
          detail="Strong / healthy"
          label="Green portfolios"
          value={String(greenCount)}
        />
        <MetricCard
          detail="Attention needed"
          label="Amber portfolios"
          value={String(amberCount)}
        />
        <MetricCard
          detail="Critical"
          label="Red portfolios"
          value={String(redCount)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardDescription>Monthly submissions</CardDescription>
            <CardTitle>Portfolio companies</CardTitle>
          </div>
          <Badge variant="secondary">{portfolioUpdates.length} updates</Badge>
        </CardHeader>
        <CardContent>
          {portfolioUpdates.length > 0 ? (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Portfolio name</TableHead>
                    <TableHead>Reporting month</TableHead>
                    <TableHead>Cash position</TableHead>
                    <TableHead>RAG status</TableHead>
                    <TableHead>Primary execution blocker</TableHead>
                    <TableHead>KPIs on track</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioUpdates.map((update) => {
                    const onTrackKpis = update.kpis.filter(
                      (kpi) => Number(kpi.actualValue) >= Number(kpi.targetValue),
                    ).length;

                    return (
                      <TableRow key={update.id}>
                        <TableCell className="min-w-48 font-medium">
                          {update.portfolioName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatMonth(update.reportingMonth)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          {formatNgn(update.cashPositionNgn)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={ragBadgeClassName(update.ragStatus)}
                            variant="outline"
                          >
                            {ragLabel(update.ragStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-72 max-w-md text-muted-foreground">
                          {update.primaryExecutionBlocker}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {onTrackKpis} / {update.kpis.length}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/dashboard/${update.id}`}>
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border bg-muted/30 px-4 py-10 text-center">
              <p className="font-medium">No portfolio submissions yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                New submissions from Portfolio Managers will appear here automatically.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
