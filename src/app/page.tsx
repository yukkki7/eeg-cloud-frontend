"use client";
import { EEGChart } from "@/components/EEGChart";
import { EEGPolygonChart } from "@/components/EEGPolygonChart";

export default function ParticipantInfoPage() {
  return (
    <div className="px-6 pt-4 pb-6 bg-white min-h-screen space-y-16">
      {/* Line chart section */}
      <section>
        <h1 className="text-2xl font-bold mb-4 text-black">EEG Line Plot</h1>
        <div className="relative w-full max-w-4xl mx-auto h-[36rem] bg-gray-50 p-4 rounded-lg shadow-sm">
          <EEGChart />
        </div>
      </section>

      {/* Spacer */}
      <div className="h-12" />

      {/* Polygon chart section */}
      <section>
        <h1 className="text-2xl font-bold mb-4 text-black">
          EEG Graph
        </h1>
        <div className="relative w-full max-w-md mx-auto h-[36rem] bg-gray-50 p-4 rounded-lg shadow-sm">
          <EEGPolygonChart />
        </div>
      </section>

      {/* Bottom padding */}
      <div className="h-20" />
    </div>
  );
}
