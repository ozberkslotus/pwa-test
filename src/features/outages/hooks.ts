"use client";

import { useQuery } from "@tanstack/react-query";
import { getOutages } from "./api";
import type { OutageStatus } from "./types";

export const outageKeys = {
  all: ["outages"] as const,
  list: (status: OutageStatus) => [...outageKeys.all, "list", status] as const,
};

export function useOutages(status: OutageStatus) {
  return useQuery({
    queryKey: outageKeys.list(status),
    queryFn: () => getOutages(status),
    // Aktif kesintiler canlı veri; sekme açıkken tazelensin
    refetchInterval: status === "active" ? 60_000 : false,
  });
}
