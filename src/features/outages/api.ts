import { api } from "@/lib/api";
import type { Outage, OutageListResponse, OutageStatus } from "./types";

// Backend hazır olana kadar sahte (mock) veri döner.
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const minutesAhead = (m: number) => new Date(Date.now() + m * 60_000).toISOString();

const MOCK: Outage[] = [
  {
    id: "1",
    status: "active",
    cause: "fault",
    region: "Mamak",
    districts: ["Abidinpaşa", "Şahintepe", "General Zeki Doğan"],
    feederCode: "F-331",
    startedAt: minutesAgo(185),
    estimatedEndAt: minutesAhead(120),
    affectedCustomers: 2180,
  },
  {
    id: "2",
    status: "active",
    cause: "weather",
    region: "Çankaya",
    districts: ["Kızılay", "Cebeci"],
    feederCode: "F-204",
    startedAt: minutesAgo(135),
    estimatedEndAt: minutesAhead(45),
    affectedCustomers: 1240,
  },
  {
    id: "3",
    status: "active",
    cause: "overload",
    region: "Keçiören",
    districts: ["Etlik"],
    feederCode: "F-118",
    startedAt: minutesAgo(48),
    estimatedEndAt: minutesAhead(60),
    affectedCustomers: 310,
  },
  {
    id: "4",
    status: "planned",
    cause: "maintenance",
    region: "Yenimahalle",
    districts: ["Demetevler", "Karşıyaka"],
    feederCode: "F-072",
    startedAt: minutesAhead(18 * 60),
    estimatedEndAt: minutesAhead(22 * 60),
    affectedCustomers: 860,
  },
  {
    id: "5",
    status: "planned",
    cause: "maintenance",
    region: "Etimesgut",
    districts: ["Eryaman"],
    feederCode: "F-255",
    startedAt: minutesAhead(42 * 60),
    estimatedEndAt: minutesAhead(46 * 60 + 30),
    affectedCustomers: 1430,
  },
  {
    id: "6",
    status: "resolved",
    cause: "fault",
    region: "Altındağ",
    districts: ["Hamamönü"],
    feederCode: "F-149",
    startedAt: minutesAgo(155),
    endedAt: minutesAgo(60),
    affectedCustomers: 540,
  },
  {
    id: "7",
    status: "resolved",
    cause: "maintenance",
    region: "Sincan",
    districts: ["Fatih", "Pınarbaşı"],
    feederCode: "F-412",
    startedAt: minutesAgo(342),
    endedAt: minutesAgo(300),
    affectedCustomers: 220,
  },
  {
    id: "8",
    status: "resolved",
    cause: "weather",
    region: "Çankaya",
    districts: ["Bahçelievler"],
    feederCode: "F-207",
    startedAt: minutesAgo(26 * 60),
    endedAt: minutesAgo(23 * 60),
    affectedCustomers: 1980,
  },
];

// Süre: biten kesintide gerçekleşen, diğerlerinde planlanan/süregelen süre
function durationMinutes(o: Outage) {
  const end = o.endedAt ?? o.estimatedEndAt ?? new Date().toISOString();
  return Math.max(0, Math.round((Date.parse(end) - Date.parse(o.startedAt)) / 60_000));
}

function summarize(items: Outage[]) {
  const affectedCustomers = items.reduce((t, o) => t + o.affectedCustomers, 0);
  const total = items.reduce((t, o) => t + durationMinutes(o), 0);
  return {
    count: items.length,
    affectedCustomers,
    avgDurationMinutes: items.length ? Math.round(total / items.length) : 0,
  };
}

export async function getOutages(status: OutageStatus): Promise<OutageListResponse> {
  if (USE_MOCK) {
    await wait(500);
    const items = MOCK.filter((o) => o.status === status);
    return { items, summary: summarize(items) };
  }
  return api<OutageListResponse>(`/outages?status=${status}`);
}
