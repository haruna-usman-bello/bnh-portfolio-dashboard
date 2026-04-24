"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Save } from "lucide-react";

import { submitPortfolioUpdate, type FieldErrors, type FormState } from "@/app/admin/submit/actions";
import { formatNgn, formatNumber } from "@/lib/format";
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

function FieldError({ errors, field }: { errors: FieldErrors | undefined; field: keyof FieldErrors }) {
  const message = errors?.[field];
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

const kpiIndexes = [1, 2, 3] as const;

export default function AdminSubmitPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitPortfolioUpdate,
    null,
  );

  const fieldErrors = state?.fieldErrors;

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
          {state?.generalError ? (
            <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.generalError}
            </div>
          ) : null}

          <form action={formAction} className="grid gap-8">
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
                  />
                  <FieldError errors={fieldErrors} field="portfolioName" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reportingMonth">Reporting month</Label>
                  <Input id="reportingMonth" name="reportingMonth" type="month" />
                  <FieldError errors={fieldErrors} field="reportingMonth" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cashPositionNgn">Current cash position in NGN</Label>
                  <Input
                    id="cashPositionNgn"
                    inputMode="decimal"
                    min="0"
                    name="cashPositionNgn"
                    placeholder={formatNgn(185_000_000)}
                    step="0.01"
                    type="number"
                  />
                  <FieldError errors={fieldErrors} field="cashPositionNgn" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ragStatus">RAG status</Label>
                  <Select defaultValue="" id="ragStatus" name="ragStatus">
                    <option disabled value="">
                      Select status
                    </option>
                    <option value="RED">Red</option>
                    <option value="AMBER">Amber</option>
                    <option value="GREEN">Green</option>
                  </Select>
                  <FieldError errors={fieldErrors} field="ragStatus" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="primaryExecutionBlocker">Primary execution blocker</Label>
                <Textarea
                  id="primaryExecutionBlocker"
                  name="primaryExecutionBlocker"
                  placeholder="What is the single largest execution risk or blocker this month?"
                />
                <FieldError errors={fieldErrors} field="primaryExecutionBlocker" />
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
                    <h3 className="mb-4 text-sm font-semibold">KPI {index}</h3>

                    <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
                      <div className="grid gap-2">
                        <Label htmlFor={`kpi${index}Name`}>Name</Label>
                        <Input
                          id={`kpi${index}Name`}
                          name={`kpi${index}Name`}
                          placeholder="Monthly revenue"
                        />
                        <FieldError errors={fieldErrors} field={`kpi${index}Name` as keyof FieldErrors} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`kpi${index}TargetValue`}>Target value</Label>
                        <Input
                          id={`kpi${index}TargetValue`}
                          inputMode="decimal"
                          name={`kpi${index}TargetValue`}
                          placeholder={formatNumber(240_000_000)}
                          step="0.01"
                          type="number"
                        />
                        <FieldError errors={fieldErrors} field={`kpi${index}TargetValue` as keyof FieldErrors} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`kpi${index}ActualValue`}>Actual value</Label>
                        <Input
                          id={`kpi${index}ActualValue`}
                          inputMode="decimal"
                          name={`kpi${index}ActualValue`}
                          placeholder={formatNumber(252_500_000)}
                          step="0.01"
                          type="number"
                        />
                        <FieldError errors={fieldErrors} field={`kpi${index}ActualValue` as keyof FieldErrors} />
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
              <Button className="w-full sm:w-fit" disabled={isPending} type="submit">
                <Save className="h-4 w-4" />
                {isPending ? "Saving…" : "Submit update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
