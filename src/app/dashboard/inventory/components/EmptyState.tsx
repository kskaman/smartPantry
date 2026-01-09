import { Card } from "@/ui/components";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card>
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-2">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Card>
  );
}
