import type { Metadata } from "next";
import { OutageStatCard } from "@/components/OutageStatCard";

export const metadata: Metadata = { title: "Kesintiler" };

export default function Page() {
  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-blue-50 p-1">
        <OutageStatCard
          title="Kesintiler"
          unplanned={[
            { label: "OG", value: 2 },
            { label: "AG", value: 2 },
          ]}
          planned={[
            { label: "OG", value: 1 },
            { label: "AG", value: 1 },
          ]}
        />

        <OutageStatCard
          title="Abone Sayıları"
          unplanned={[
            { label: "OG", value: 2 },
            { label: "AG", value: 2 },
            { label: "DGS", value: 1, color: "blue-inverse" },
          ]}
          planned={[
            { label: "OG", value: 1 },
            { label: "AG", value: 1 },
            { label: "DGS", value: 1 },
          ]}
        />
      </div>
    </main>
  );
}
