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
  onPointClick?: (sec: number) => void;
  revealUpTo?: number;
  onPlayPause?: () => void;
  isPlaying?: boolean;
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

export const EEGChart: FC<EEGChartProps> = ({
  onPointClick,
  revealUpTo,
  onPlayPause,
  isPlaying,
}) => {
  // load recorded EEG data
  const raw: EEGRawData = mockEEG;
  const { labels = [], datasets } = parseEEGColumnar(raw);

  // determine display range
  const total = labels.length;
  const end =
    revealUpTo != null ? Math.min(total, Math.floor(revealUpTo) + 1) : total;
  const start = Math.max(0, end - 10);

  // slice for last 10s
  const data: ChartData<"line"> = {
    labels: labels.slice(start, end),
    datasets: datasets.map((ds) => ({
      ...ds,
      data: (ds.data as number[]).slice(start, end),
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black",
          font: { size: 18 }, // legend font
        },
      },
      title: {
        display: true,
        text: "EEG Metrics (Last 10s)",
        color: "black",
        font: { size: 20 }, // title font
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (s)",
          color: "black",
          font: { size: 16 }, // x-axis title
        },
        ticks: {
          color: "black",
          font: { size: 14 }, // x-axis tick labels
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
          color: "black",
          font: { size: 16 }, // y-axis title
        },
        ticks: {
          color: "black",
          font: { size: 14 }, // y-axis tick labels
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
    <div className="relative flex flex-col h-full p-4">
      {onPlayPause && (
        <button
          onClick={onPlayPause}
          className="absolute top-2 left-2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full shadow"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      )}
      <div className="flex-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
