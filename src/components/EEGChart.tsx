// src/components/EEGChart.tsx
"use client";

import React, { FC, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions, ChartEvent } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { mockEEG } from "@/data/mockEEG";
import { parseEEGColumnar } from "@/data/parseEEG";
import type { EEGRawData } from "@/data/types";

interface EEGChartProps {
  onPointClick?: (sec: number) => void;
  revealUpTo?: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EEGChart: FC<EEGChartProps> = ({ onPointClick, revealUpTo }) => {
  // 1. Load and parse the raw EEG data
  const raw: EEGRawData = mockEEG;
  const { labels = [], datasets: allDatasets } = parseEEGColumnar(raw);
  const channelNames = useMemo(
    () => allDatasets.map((ds) => ds.label as string),
    [allDatasets]
  );

  // 2. State for managing channel selection
  const [selectedChannels, setSelectedChannels] = useState<
    Record<string, boolean>
  >(Object.fromEntries(channelNames.map((name) => [name, true])));

  const selectedCount = useMemo(
    () => Object.values(selectedChannels).filter(Boolean).length,
    [selectedChannels]
  );

  // 3. Handler for checkbox clicks, ensuring at least one is selected
  const toggleChannel = (channelName: string) => {
    if (selectedCount === 1 && selectedChannels[channelName]) {
      alert("At least one channel must be selected.");
      return;
    }
    setSelectedChannels((prev) => ({
      ...prev,
      [channelName]: !prev[channelName],
    }));
  };

  // 4. Filter datasets based on selection
  const filteredDatasets = useMemo(
    () => allDatasets.filter((ds) => selectedChannels[ds.label as string]),
    [allDatasets, selectedChannels]
  );

  // Determine the display range (last 10 seconds)
  const total = labels.length;
  const end =
    revealUpTo != null ? Math.min(total, Math.floor(revealUpTo) + 1) : total;
  const start = Math.max(0, end - 10);
  const slicedLabels = labels.slice(start, end);
  const dataLength = slicedLabels.length;

  // Prepare the final data object for the chart
  const data: ChartData<"line"> = {
    labels: slicedLabels,
    datasets: filteredDatasets.map((ds) => {
      const slicedData = (ds.data as number[]).slice(start, end);

      const pointRadius = Array(dataLength).fill(3);
      if (dataLength > 0) {
        pointRadius[dataLength - 1] = 7;
      }

      return {
        ...ds,
        data: slicedData,
        pointRadius: pointRadius,
        borderWidth: 1.5,
      };
    }),
  };

  // Prepare dynamic grid line styles
  const gridLineColors = Array(dataLength).fill("rgba(0, 0, 0, 0.1)");
  const gridLineWidths = Array(dataLength).fill(1);
  if (dataLength > 0) {
    // MODIFIED: Changed the highlight color to a neutral dark gray
    gridLineColors[dataLength - 1] = "rgba(117, 117, 117, 0.75)";
    gridLineWidths[dataLength - 1] = 2.5;
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black",
          font: { size: 18 },
        },
      },
      title: {
        display: true,
        text: "EEG Metrics (Last 10s)",
        color: "black",
        font: { size: 20 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (s)",
          color: "black",
          font: { size: 16 },
        },
        ticks: {
          color: "black",
          font: { size: 14 },
        },
        grid: {
          color: gridLineColors,
          lineWidth: gridLineWidths,
        },
      },
      y: {
        title: {
          display: true,
          text: "Score",
          color: "black",
          font: { size: 16 },
        },
        ticks: {
          color: "black",
          font: { size: 14 },
        },
      },
    },
    onClick: (_evt: ChartEvent, elements) => {
      if (elements.length && data.labels) {
        const idx = elements[0].index;
        const sec = parseFloat(data.labels[idx] as string);
        onPointClick?.(sec);
      }
    },
  };

  return (
    <div className="relative flex flex-col h-full p-4 space-y-4">
      {/* 5. Render checkboxes for channel selection */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="font-medium text-black">Channels:</span>
        {channelNames.map((name) => (
          <label
            key={name}
            className="inline-flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedChannels[name]}
              onChange={() => toggleChannel(name)}
              className="form-checkbox h-4 w-4 rounded"
            />
            <span className="text-black capitalize">{name}</span>
          </label>
        ))}
      </div>
      <div className="flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
