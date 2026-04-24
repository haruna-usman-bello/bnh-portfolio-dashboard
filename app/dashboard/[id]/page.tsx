import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

type PortfolioDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ngnFormatter = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  maximumFractionDigits: 0,
  style: "currency",
});

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function formatNgn(value: unknown) {
  return ngnFormatter.format(Number(value));
}

function formatNumber(value: unknown) {
  return Number(value).toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  });
}

function formatVariance(value: number) {
  const formattedValue = Math.abs(value).toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  });

  if (value > 0) {
    return `+${formattedValue}`;
  }

  if (value < 0) {
    return `-${formattedValue}`;
  }

  return "0";
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

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { id } = await params;
  const update = await prisma.portfolioUpdate.findUnique({
    include: {
      kpis: true,
    },
    where: {
      id,
    },
  });

  if (!update) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Portfolio details"
      title={update.portfolioName}
      description={`${monthFormatter.format(update.reportingMonth)} performance and execution context.`}
      action={
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Reporting month</CardDescription>
            <CardTitle>{monthFormatter.format(update.reportingMonth)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Cash position</CardDescription>
            <CardTitle>{formatNgn(update.cashPositionNgn)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>RAG status</CardDescription>
            <CardTitle>
              <Badge className={ragBadgeClassName(update.ragStatus)} variant="outline">
                {ragLabel(update.ragStatus)}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Execution risk</CardDescription>
          <CardTitle>Primary blocker</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {update.primaryExecutionBlocker}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Submitted indicators</CardDescription>
          <CardTitle>KPI performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>KPI</TableHead>
                  <TableHead className="text-right">Target value</TableHead>
                  <TableHead className="text-right">Actual value</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {update.kpis.map((kpi) => {
                  const targetValue = Number(kpi.targetValue);
                  const actualValue = Number(kpi.actualValue);
                  const variance = actualValue - targetValue;

                  return (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">{kpi.name}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(targetValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(actualValue)}
                      </TableCell>
                      <TableCell
                        className={
                          variance >= 0
                            ? "text-right font-medium text-green-700"
                            : "text-right font-medium text-red-700"
                        }
                      >
                        {formatVariance(variance)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
