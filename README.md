# Portfolio Intelligence Dashboard

A simple internal prototype for collecting monthly portfolio company updates and giving the Chief of Staff an executive view of portfolio health.

Portfolio Managers submit cash position, RAG status, primary blockers, and three KPIs. The dashboard reads those submissions from PostgreSQL and summarizes portfolio exposure, health status, and KPI performance.

## Tech Stack

- Next.js App Router with TypeScript
- React Server Components and Server Actions
- Tailwind CSS
- Shadcn UI-style components
- Prisma 7
- PostgreSQL

## Run Locally

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

If port `3000` is busy, Next.js will print the alternate local URL.

## Configure Database

Set `DATABASE_URL` in `.env` to your PostgreSQL database:

```env
DATABASE_URL="postgresql://postgres:2004@localhost:5432/bnh?schema=public"
```

Make sure PostgreSQL is running and the database exists before running Prisma commands.

## Prisma Migration

Generate the Prisma client:

```bash
npx prisma generate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name portfolio-intelligence-dashboard
```

For quick local prototyping, you can push the schema directly:

```bash
npx prisma db push
```

## Seed Sample Data

The seed script creates three fictitious portfolio companies:

- Alpha Foods Limited
- NovaPay Finance
- GreenGrid Energy

Run:

```bash
npx prisma db seed
```

The seed command is configured in `prisma.config.ts` and uses `prisma/seed.ts`.

## Test The Prototype

1. Start PostgreSQL.
2. Confirm `DATABASE_URL` points to your local database.
3. Run `npx prisma migrate dev --name portfolio-intelligence-dashboard`.
4. Run `npx prisma db seed`.
5. Run `npm run dev`.
6. Open `/dashboard` to review seeded portfolio submissions.
7. Open `/admin/submit` to add a new monthly update.
8. Return to `/dashboard` and use the View button to inspect one portfolio in detail.

## Useful Routes

- `/` - prototype home
- `/dashboard` - Chief of Staff dashboard
- `/dashboard/[id]` - portfolio update detail page
- `/admin/submit` - Portfolio Manager submission form

## Verification

Run local checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
