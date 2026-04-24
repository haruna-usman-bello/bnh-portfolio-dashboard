import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RagStatus } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const portfolioUpdates = [
  {
    portfolioName: "Alpha Foods Limited",
    reportingMonth: new Date("2026-03-01"),
    cashPositionNgn: "185000000.00",
    ragStatus: RagStatus.GREEN,
    primaryExecutionBlocker: "Scaling cold-chain distribution without eroding gross margin.",
    kpis: [
      { name: "Monthly revenue", targetValue: "240000000.00", actualValue: "252500000.00" },
      { name: "Gross margin percentage", targetValue: "34.00", actualValue: "36.50" },
      { name: "Retail outlet coverage", targetValue: "1250.00", actualValue: "1315.00" },
    ],
  },
  {
    portfolioName: "NovaPay Finance",
    reportingMonth: new Date("2026-03-01"),
    cashPositionNgn: "92000000.00",
    ragStatus: RagStatus.AMBER,
    primaryExecutionBlocker: "Delayed banking partner approvals for new merchant settlement rails.",
    kpis: [
      { name: "Active merchants", targetValue: "18000.00", actualValue: "16450.00" },
      { name: "Transaction success rate", targetValue: "98.50", actualValue: "97.20" },
      { name: "Monthly transaction value", targetValue: "4500000000.00", actualValue: "4100000000.00" },
    ],
  },
  {
    portfolioName: "GreenGrid Energy",
    reportingMonth: new Date("2026-03-01"),
    cashPositionNgn: "61000000.00",
    ragStatus: RagStatus.RED,
    primaryExecutionBlocker: "Imported inverter delivery delays are blocking site commissioning.",
    kpis: [
      { name: "Installed sites", targetValue: "42.00", actualValue: "29.00" },
      { name: "Average uptime percentage", targetValue: "96.00", actualValue: "91.40" },
      { name: "Monthly recurring revenue", targetValue: "72000000.00", actualValue: "54800000.00" },
    ],
  },
];

async function main() {
  await prisma.kpi.deleteMany();
  await prisma.portfolioUpdate.deleteMany();

  for (const update of portfolioUpdates) {
    await prisma.portfolioUpdate.create({
      data: {
        portfolioName: update.portfolioName,
        reportingMonth: update.reportingMonth,
        cashPositionNgn: update.cashPositionNgn,
        ragStatus: update.ragStatus,
        primaryExecutionBlocker: update.primaryExecutionBlocker,
        kpis: {
          create: update.kpis,
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
