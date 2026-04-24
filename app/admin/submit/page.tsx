import Link from "next/link";
import { ArrowLeft, BarChart3, Save } from "lucide-react";

import { submitPortfolioUpdate } from "@/app/admin/submit/actions";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type SubmitPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const kpiIndexes = [1, 2, 3];

export default async function AdminSubmitPage({ searchParams }: SubmitPageProps) {
  const { error } = await searchParams;

  return (
    <PageShell
      eyebrow="Portfolio manager"
      title="Submit monthly update"
      description="Capture the operating signal leadership needs for the monthly portfolio review."
      action={
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader className="border-b">
          <CardDescription>Monthly portfolio update</CardDescription>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Company performance submission
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error ? (
            <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <form action={submitPortfolioUpdate} className="grid gap-8">
            <section className="grid gap-4">
              <div className="grid gap-1">
                <h2 className="text-base font-semibold">Portfolio details</h2>
                <p className="text-sm text-muted-foreground">
                  Core company context for the current reporting cycle.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="portfolioName">Portfolio name</Label>
                  <Input
                    id="portfolioName"
                    name="portfolioName"
                    placeholder="Alpha Foods Limited"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reportingMonth">Reporting month</Label>
                  <Input id="reportingMonth" name="reportingMonth" required type="month" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cashPositionNgn">Current cash position in NGN</Label>
                  <Input
                    id="cashPositionNgn"
                    inputMode="decimal"
                    min="0"
                    name="cashPositionNgn"
                    placeholder="185000000"
                    required
                    step="0.01"
                    type="number"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ragStatus">RAG status</Label>
                  <Select defaultValue="" id="ragStatus" name="ragStatus" required>
                    <option disabled value="">
                      Select status
                    </option>
                    <option value="RED">Red</option>
                    <option value="AMBER">Amber</option>
                    <option value="GREEN">Green</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="primaryExecutionBlocker">Primary execution blocker</Label>
                <Textarea
                  id="primaryExecutionBlocker"
                  name="primaryExecutionBlocker"
                  placeholder="What is the single largest execution risk or blocker this month?"
                  required
                />
              </div>
            </section>

            <section className="grid gap-4">
              <div className="grid gap-1">
                <h2 className="text-base font-semibold">Monthly KPIs</h2>
                <p className="text-sm text-muted-foreground">
                  Submit exactly three measurable indicators with target and actual values.
                </p>
              </div>

              <div className="grid gap-4">
                {kpiIndexes.map((index) => (
                  <div className="rounded-md border bg-muted/30 p-4" key={index}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold">KPI {index}</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
                      <div className="grid gap-2">
                        <Label htmlFor={`kpi${index}Name`}>Name</Label>
                        <Input
                          id={`kpi${index}Name`}
                          name={`kpi${index}Name`}
                          placeholder="Monthly revenue"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`kpi${index}TargetValue`}>Target value</Label>
                        <Input
                          id={`kpi${index}TargetValue`}
                          inputMode="decimal"
                          name={`kpi${index}TargetValue`}
                          placeholder="240000000"
                          required
                          step="0.01"
                          type="number"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`kpi${index}ActualValue`}>Actual value</Label>
                        <Input
                          id={`kpi${index}ActualValue`}
                          inputMode="decimal"
                          name={`kpi${index}ActualValue`}
                          placeholder="252500000"
                          required
                          step="0.01"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Submission will be saved directly to the portfolio database.
              </p>
              <Button className="w-full sm:w-fit" type="submit">
                <Save className="h-4 w-4" />
                Submit update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
