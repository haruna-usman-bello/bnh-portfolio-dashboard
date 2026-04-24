import { RagStatus } from "@/lib/generated/prisma/client";
import { Badge } from "@/components/ui/badge";

const classNames: Record<RagStatus, string> = {
  [RagStatus.GREEN]: "border-green-700/20 bg-green-50 text-green-800",
  [RagStatus.AMBER]: "border-amber-700/20 bg-amber-50 text-amber-800",
  [RagStatus.RED]: "border-red-700/20 bg-red-50 text-red-800",
};

const labels: Record<RagStatus, string> = {
  [RagStatus.GREEN]: "Green",
  [RagStatus.AMBER]: "Amber",
  [RagStatus.RED]: "Red",
};

export function RagBadge({ status }: { status: RagStatus }) {
  return (
    <Badge className={classNames[status]} variant="outline">
      {labels[status]}
    </Badge>
  );
}
