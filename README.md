# Portfolio Intelligence Dashboard

A clean Next.js App Router starter for collecting portfolio company updates and viewing executive portfolio signals.

## Stack

- Next.js with TypeScript
- Tailwind CSS
- Shadcn UI-style components
- Prisma
- PostgreSQL
- No authentication

## Getting Started

Create a local environment file:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env`, then generate the Prisma client and run the development server:

```bash
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Routes

- `/` landing page
- `/submit` portfolio update intake
- `/dashboard` executive dashboard view

## Prisma

The Prisma schema lives in `prisma/schema.prisma`. The project expects a PostgreSQL connection string in `DATABASE_URL`.

```bash
npx prisma migrate dev
```

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
