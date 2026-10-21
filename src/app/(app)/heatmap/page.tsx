import type { Metadata } from "next";

export const metadata: Metadata = { title: "Yoğunluk Haritası" };

export default function Page() {
  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-brand/30 bg-brand-light p-6 text-center">
        <p className="text-[15px] leading-relaxed text-brand-dark">Yoğunluk haritası buraya gelecek.</p>
      </div>
    </main>
  );
}
