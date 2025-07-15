// src/app/flow/charts/page.tsx
"use client";

import React from "react";
import { EEGChart } from "@/components/EEGChart";
import { EEGPolygonChart } from "@/components/EEGPolygonChart";

export default function ChartsPage() {
  return (
    <div className="px-6 pt-4 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Video placeholder */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Participant Video
          </h2>
          <div className="w-full h-130 bg-black rounded-lg overflow-hidden shadow-inner">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Video Placeholder
            </div>
          </div>
        </section>

        {/* Charts side by side */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">
            EEG Visualizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Line plot */}
            <div className="w-full bg-gray-50 p-4 rounded-lg shadow-sm min-h-[40rem]">
              <h3 className="text-lg font-medium mb-2 text-black text-center">
                Line Plot
              </h3>
              <EEGChart />
            </div>

            {/* Polygon chart */}
            <div className="w-full bg-gray-50 p-4 rounded-lg shadow-sm min-h-[40rem]">
              <h3 className="text-lg font-medium mb-2 text-black text-center">
                Polygon Chart
              </h3>
              <EEGPolygonChart />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
