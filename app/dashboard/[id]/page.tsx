import Link from "next/link";
import { notFound } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMonth, formatNgn, formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { RagBadge } from "@/components/rag-badge";

type PortfolioDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatVariance(value: number) {
  const formattedValue = Math.abs(value).toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  });

  if (value > 0) return `+${formattedValue}`;
  if (value < 0) return `-${formattedValue}`;
  return "0";
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
      description={`${formatMonth(update.reportingMonth)} performance and execution context.`}
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
            <CardTitle>{formatMonth(update.reportingMonth)}</CardTitle>
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
              <RagBadge status={update.ragStatus} />
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
