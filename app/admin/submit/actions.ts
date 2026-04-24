"use server";

import { redirect } from "next/navigation";

import { RagStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const ragStatuses = new Set<string>(Object.values(RagStatus));

function readRequired(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value.trim();
}

function readNumber(formData: FormData, key: string) {
  const rawValue = readRequired(formData, key);

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    return null;
  }

  return rawValue;
}

function redirectWithError(message: string): never {
  redirect(`/admin/submit?error=${encodeURIComponent(message)}`);
}

export async function submitPortfolioUpdate(formData: FormData) {
  const portfolioName = readRequired(formData, "portfolioName");
  const reportingMonth = readRequired(formData, "reportingMonth");
  const cashPositionNgn = readNumber(formData, "cashPositionNgn");
  const ragStatus = readRequired(formData, "ragStatus");
  const primaryExecutionBlocker = readRequired(formData, "primaryExecutionBlocker");

  if (
    !portfolioName ||
    !reportingMonth ||
    !cashPositionNgn ||
    !ragStatus ||
    !primaryExecutionBlocker
  ) {
    redirectWithError("Please complete every required field.");
  }

  if (!/^\d{4}-\d{2}$/.test(reportingMonth)) {
    redirectWithError("Please select a valid reporting month.");
  }

  if (!ragStatuses.has(ragStatus)) {
    redirectWithError("Please select a valid RAG status.");
  }

  const kpis = [1, 2, 3].map((index) => {
    const name = readRequired(formData, `kpi${index}Name`);
    const targetValue = readNumber(formData, `kpi${index}TargetValue`);
    const actualValue = readNumber(formData, `kpi${index}ActualValue`);

    if (!name || !targetValue || !actualValue) {
      redirectWithError(`Please complete all fields for KPI ${index}.`);
    }

    return {
      name,
      targetValue,
      actualValue,
    };
  });

  let didSave = false;

  try {
    await prisma.portfolioUpdate.create({
      data: {
        portfolioName,
        reportingMonth: new Date(`${reportingMonth}-01T00:00:00.000Z`),
        cashPositionNgn,
        ragStatus: ragStatus as RagStatus,
        primaryExecutionBlocker,
        kpis: {
          create: kpis,
        },
      },
    });

    didSave = true;
  } catch (error) {
    console.error(error);
  }

  if (!didSave) {
    redirectWithError("The update could not be saved. Please try again.");
  }

  redirect("/dashboard?submitted=1");
}
