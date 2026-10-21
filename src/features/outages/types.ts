export type OutageStatus = "active" | "planned" | "resolved";

export type OutageCause = "fault" | "maintenance" | "weather" | "overload";

export type Outage = {
  id: string;
  status: OutageStatus;
  cause: OutageCause;
  region: string;
  districts: string[];
  feederCode: string;
  startedAt: string;
  estimatedEndAt?: string;
  endedAt?: string;
  affectedCustomers: number;
};

export type OutageSummary = {
  count: number;
  affectedCustomers: number;
  avgDurationMinutes: number;
};

export type OutageListResponse = {
  items: Outage[];
  summary: OutageSummary;
};
