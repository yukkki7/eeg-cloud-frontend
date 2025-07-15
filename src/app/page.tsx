// src/app/flow/charts/page.tsx
"use client";

import React from "react";
import { EEGChart } from "@/components/EEGChart";
import { EEGPolygonChart } from "@/components/EEGPolygonChart";

export default function ChartsPage() {
  return (
    <div className="w-full min-h-screen bg-white px-2 py-6">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        {/* Participant Video */}
        <section>
          <h2 className="text-2xl font-semibold mb-1 text-black">
            Participant Video
          </h2>
          <div className="w-full h-96 bg-black rounded-lg overflow-hidden shadow-inner">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Video Placeholder
            </div>
          </div>
        </section>

        {/* EEG Visualizations */}
        <section>
          <h2 className="text-2xl font-semibold mb-1 text-black">
            EEG Visualizations
          </h2>
          <div className="w-full flex gap-8">
            {/* Line Plot: takes 6 parts */}
            <div className="flex-[6] bg-gray-50 p-4 rounded-lg shadow-sm h-[48rem] flex flex-col">
              <h3 className="text-lg font-medium mb-1 text-center text-black">
                Line Plot
              </h3>
              <div className="flex-1">
                <EEGChart />
              </div>
            </div>

            {/* Polygon Chart: takes 4 parts */}
            <div className="flex-[4] bg-gray-50 p-4 rounded-lg shadow-sm h-[48rem] flex flex-col">
              <h3 className="text-lg font-medium mb-1 text-center text-black">
                Polygon Chart
              </h3>
              <div className="flex-1 overflow-hidden">
                <EEGPolygonChart />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
