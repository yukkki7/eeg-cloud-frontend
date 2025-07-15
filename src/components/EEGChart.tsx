// src/components/EEGChart.tsx
"use client";

import { FC, useState } from "react";
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

import { mockEEG } from "../data/mockEEG";
import { parseEEGColumnar } from "../data/parseEEG";
import type { EEGRawData } from "../data/types";

interface EEGChartProps {
  /** called with the clicked time (seconds) */
  onPointClick?: (sec: number) => void;
}

// register modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EEGChart: FC<EEGChartProps> = ({ onPointClick }) => {
  const raw: EEGRawData = mockEEG;
  const { labels = [], datasets } = parseEEGColumnar(raw);

  const maxIndex = labels.length;
  const defaultEnd = Math.min(30, maxIndex);
  const [startStr, setStartStr] = useState("0");
  const [endStr, setEndStr] = useState(String(defaultEnd));
  const [error, setError] = useState("");

  // validate inputs
  const validate = (s: string, e: string): string => {
    const si = Number(s),
      ei = Number(e);
    if (
      s === "" ||
      e === "" ||
      isNaN(si) ||
      isNaN(ei) ||
      !Number.isInteger(si) ||
      !Number.isInteger(ei) ||
      si < 0 ||
      ei > maxIndex ||
      si >= ei
    ) {
      return "Unsupported input, please re-enter.";
    }
    return "";
  };

  const onChange = (which: "start" | "end", val: string) => {
    if (which === "start") setStartStr(val);
    else setEndStr(val);
    setError(
      validate(
        which === "start" ? val : startStr,
        which === "end" ? val : endStr
      )
    );
  };

  // build chartData when valid
  let chartData: ChartData<"line"> | null = null;
  if (!error) {
    const s = Number(startStr),
      e = Number(endStr);
    chartData = {
      labels: labels.slice(s, e),
      datasets: datasets.map((ds) => ({
        ...ds,
        data: (ds.data as number[]).slice(s, e),
      })),
    };
  }

  // add onClick handler to options
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
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
    onClick: (evt: ChartEvent, elements) => {
      if (elements.length && chartData) {
        // elements[0].index is the clicked data index
        const idx = elements[0].index;
        const label = chartData.labels?.[idx] as string;
        // label is like "12.0s", parse number
        const sec = parseFloat(label);
        onPointClick?.(sec);
      }
    },
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* inputs */}
      <div className="flex space-x-4 mb-4">
        <div className="flex flex-col">
          <label className="text-black">Start (s):</label>
          <input
            type="number"
            step={1}
            min={0}
            max={Number(endStr) - 1}
            value={startStr}
            onChange={(e) => onChange("start", e.target.value)}
            className="border p-1 w-24 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black">End (s):</label>
          <input
            type="number"
            step={1}
            min={Number(startStr) + 1}
            max={maxIndex}
            value={endStr}
            onChange={(e) => onChange("end", e.target.value)}
            className="border p-1 w-24 text-black"
          />
        </div>
      </div>

      {/* error */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* chart */}
      <div className="flex-1">
        {chartData && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};
