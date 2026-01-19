import { Card } from "@/ui/components";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card>
      <div className="text-center py-12">
        <p className="text-subheading mb-2" style={{ color: "var(--text-muted)" }}>{title}</p>
        <p className="text-small" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
    </Card>
  );
}
