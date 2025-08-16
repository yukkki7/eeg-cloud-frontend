// src/app/history-echarts/page.tsx
"use client";

import React from "react";
import { HistoryPanelECharts } from "@/components/HistoryPanelECharts";

export default function EChartsHistoryPage() {
  return (
    <div className="w-full min-h-screen bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <HistoryPanelECharts />
      </div>
    </div>
  );
}
