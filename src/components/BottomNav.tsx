"use client";

import {
  AreaChartOutlined,
  HeatMapOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_ROUTES, matchRoute } from "@/lib/routes";

const ICONS: Record<string, React.ReactNode> = {
  "/regional-performance": <AreaChartOutlined />,
  "/outages": <ThunderboltOutlined />,
  "/heatmap": <HeatMapOutlined />,
  "/feeders": <NodeIndexOutlined />,
};

export function BottomNav() {
  const pathname = usePathname();
  const active = matchRoute(pathname)?.href;

  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-4 border-t border-black/5 bg-white/95 backdrop-blur">
      {APP_ROUTES.map(({ href, label }) => {
        const isActive = href === active;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium no-underline transition-colors ${
              isActive ? "text-brand" : "text-muted"
            }`}
          >
            <span className="text-[20px] leading-none">{ICONS[href]}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
