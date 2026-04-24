import Link from "next/link";
import { BarChart3, ClipboardPenLine } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link className="min-w-0" href="/">
          <p className="text-sm font-medium text-muted-foreground">BNH Portfolio</p>
          <p className="truncate text-base font-semibold tracking-tight">
            Portfolio Intelligence Dashboard
          </p>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Primary navigation">
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/submit">
              <ClipboardPenLine className="h-4 w-4" />
              Submit
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
