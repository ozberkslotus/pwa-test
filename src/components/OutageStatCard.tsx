import { Card, Tag } from "antd";
import { AlertTriangle, CalendarCheck } from "lucide-react";

// Kesinti ekranındaki sayaç etiketi (ör. "OG: 2")
export type OutageStatItem = {
  label: string;
  value: number;
  /** Satırın varsayılan etiket rengini ezmek için */
  color?: string;
};

export type OutageStatVariant = "unplanned" | "planned";

const VARIANTS: Record<
  OutageStatVariant,
  {
    title: string;
    Icon: typeof AlertTriangle;
    box: string;
    icon: string;
    text: string;
    tagColor: string;
  }
> = {
  unplanned: {
    title: "Bildirimsiz",
    Icon: AlertTriangle,
    box: "bg-amber-50/60 border-amber-100",
    icon: "text-amber-600",
    text: "text-amber-900",
    tagColor: "gold-inverse",
  },
  planned: {
    title: "Bildirimli",
    Icon: CalendarCheck,
    box: "bg-slate-100 border-slate-200/80",
    icon: "text-slate-600",
    text: "text-slate-700",
    tagColor: "blue-inverse",
  },
};

function OutageStatRow({
  variant,
  items,
}: {
  variant: OutageStatVariant;
  items: OutageStatItem[];
}) {
  const { title, Icon, box, icon, text, tagColor } = VARIANTS[variant];

  return (
    <div className={`flex flex-col justify-between rounded-xl border p-3.5 ${box}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${icon}`} />
        <span className={`text-sm font-semibold ${text}`}>{title}</span>
      </div>

      <div className="flex items-center gap-2">
        {items.map((item) => (
          <Tag key={item.label} color={item.color ?? tagColor}>
            {item.label}: {item.value}
          </Tag>
        ))}
      </div>
    </div>
  );
}

// Bildirimsiz/bildirimli kırılımını tek kartta gösteren sayaç bloğu
export function OutageStatCard({
  title,
  unplanned,
  planned,
}: {
  title: string;
  unplanned: OutageStatItem[];
  planned: OutageStatItem[];
}) {
  return (
    <Card title={<h3 className="flex font-semibold text-slate-800">{title}</h3>}>
      <div className="grid gap-3">
        <OutageStatRow variant="unplanned" items={unplanned} />
        <OutageStatRow variant="planned" items={planned} />
      </div>
    </Card>
  );
}
