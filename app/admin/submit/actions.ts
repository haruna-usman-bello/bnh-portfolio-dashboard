"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { RagStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function numeric(emptyMessage: string, invalidMessage: string) {
  return z
    .string()
    .trim()
    .min(1, emptyMessage)
    .refine((v) => Number.isFinite(Number(v)), invalidMessage);
}

const schema = z.object({
  portfolioName: z
    .string()
    .trim()
    .min(1, "Enter the portfolio company name."),
  reportingMonth: z
    .string()
    .trim()
    .min(1, "Select a reporting month.")
    .regex(/^\d{4}-\d{2}$/, "Select a valid month from the picker."),
  cashPositionNgn: numeric(
    "Enter the current cash position.",
    "Cash position must be a number.",
  ),
  ragStatus: z.enum(["RED", "AMBER", "GREEN"], {
    message: "Select a RAG status — Red, Amber, or Green.",
  }),
  primaryExecutionBlocker: z
    .string()
    .trim()
    .min(1, "Describe the primary execution blocker."),
  kpi1Name: z.string().trim().min(1, "Enter a name for KPI 1."),
  kpi1TargetValue: numeric("Enter the target value for KPI 1.", "Target value for KPI 1 must be a number."),
  kpi1ActualValue: numeric("Enter the actual value for KPI 1.", "Actual value for KPI 1 must be a number."),
  kpi2Name: z.string().trim().min(1, "Enter a name for KPI 2."),
  kpi2TargetValue: numeric("Enter the target value for KPI 2.", "Target value for KPI 2 must be a number."),
  kpi2ActualValue: numeric("Enter the actual value for KPI 2.", "Actual value for KPI 2 must be a number."),
  kpi3Name: z.string().trim().min(1, "Enter a name for KPI 3."),
  kpi3TargetValue: numeric("Enter the target value for KPI 3.", "Target value for KPI 3 must be a number."),
  kpi3ActualValue: numeric("Enter the actual value for KPI 3.", "Actual value for KPI 3 must be a number."),
});

export type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export type FormState = {
  fieldErrors?: FieldErrors;
  generalError?: string;
} | null;

export async function submitPortfolioUpdate(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = schema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FieldErrors;
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }

  const d = result.data;

  const kpis = [
    { name: d.kpi1Name, targetValue: d.kpi1TargetValue, actualValue: d.kpi1ActualValue },
    { name: d.kpi2Name, targetValue: d.kpi2TargetValue, actualValue: d.kpi2ActualValue },
    { name: d.kpi3Name, targetValue: d.kpi3TargetValue, actualValue: d.kpi3ActualValue },
  ];

  try {
    await prisma.portfolioUpdate.create({
      data: {
        portfolioName: d.portfolioName,
        reportingMonth: new Date(`${d.reportingMonth}-01T00:00:00.000Z`),
        cashPositionNgn: d.cashPositionNgn,
        ragStatus: d.ragStatus as RagStatus,
        primaryExecutionBlocker: d.primaryExecutionBlocker,
        kpis: { create: kpis },
      },
    });
  } catch (error) {
    console.error(error);
    return { generalError: "The update could not be saved. Please try again." };
  }

  redirect("/dashboard?submitted=1");
}
