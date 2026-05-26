import { Card } from "./ui";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          {trend && trendValue && (
            <p
              className={`text-sm mt-2 ${
                trend === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-subtle rounded-lg text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}
