// src/components/EEGChart.tsx
"use client";

import React, { FC } from "react";
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
  /** Called when a data point is clicked */
  onPointClick?: (sec: number) => void;
  /** Only display data up to this second (inclusive) */
  revealUpTo?: number;
  /** Callback to play or pause the main video */
  onPlayPause?: () => void;
  /** Whether the main video is currently playing */
  isPlaying?: boolean;
}

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EEGChart: FC<EEGChartProps> = ({
  onPointClick,
  revealUpTo,
  onPlayPause,
  isPlaying,
}) => {
  // Use recorded EEG data
  const raw: EEGRawData = mockEEG;
  const { labels = [], datasets } = parseEEGColumnar(raw);

  // Calculate how many points to display
  const totalPoints = labels.length;
  const endIndex =
    revealUpTo != null
      ? Math.min(totalPoints, Math.floor(revealUpTo) + 1)
      : totalPoints;

  // Prepare sliced chart data
  const chartData: ChartData<"line"> = {
    labels: labels.slice(0, endIndex),
    datasets: datasets.map((ds) => ({
      ...ds,
      data: (ds.data as number[]).slice(0, endIndex),
    })),
  };

  // Chart configuration
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // Turn off animations for sync
    plugins: {
      legend: { position: "top", labels: { color: "black" } },
      title: { display: true, text: "EEG Metrics", color: "black" },
    },
    scales: {
      x: {
        title: { display: true, text: "Time (s)", color: "black" },
        ticks: { color: "black" },
      },
      y: {
        title: { display: true, text: "Value", color: "black" },
        ticks: { color: "black" },
      },
    },
    onClick: (_evt: ChartEvent, elements) => {
      if (elements.length && chartData.labels) {
        const idx = elements[0].index;
        const sec = parseFloat(chartData.labels[idx] as string);
        onPointClick?.(sec);
      }
    },
  };

  return (
    <div className="relative flex flex-col h-full p-4">
      {/* Play/Pause button at top-left */}
      {onPlayPause && (
        <button
          onClick={onPlayPause}
          className="absolute top-2 left-2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full shadow"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      )}

      {/* Line chart */}
      <div className="flex-1">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
