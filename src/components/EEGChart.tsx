// src/components/EEGChart.tsx
"use client";
import { FC, useState } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";
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

// register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EEGChart: FC = () => {
  const raw: EEGRawData = mockEEG;
  const { labels = [], datasets } = parseEEGColumnar(raw);

  const maxIndex = labels.length;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(maxIndex);
  const [selected, setSelected] = useState(
    Object.fromEntries(
      Object.keys(raw.channels).map((ch) => [ch, true])
    ) as Record<string, boolean>
  );

  const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = Number(e.target.value);
    if (isNaN(v)) return;
    v = Math.max(0, Math.min(v, end - 1));
    setStart(v);
  };

  const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = Number(e.target.value);
    if (isNaN(v)) return;
    v = Math.max(start + 1, Math.min(v, maxIndex));
    setEnd(v);
  };

  const windowLabels = labels.slice(start, end);
  const windowDatasets = datasets
    .filter((ds) => selected[ds.label as string])
    .map((ds) => ({
      ...ds,
      data: (ds.data as number[]).slice(start, end),
    }));

  const data: ChartData<"line"> = {
    labels: windowLabels,
    datasets: windowDatasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { color: "black" } },
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
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex flex-col">
          <label className="text-black mb-1">Start (s):</label>
          <input
            type="number"
            min={0}
            max={end - 1}
            value={start}
            onChange={handleStart}
            className="border p-1 w-20 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black mb-1">End (s):</label>
          <input
            type="number"
            min={start + 1}
            max={maxIndex}
            value={end}
            onChange={handleEnd}
            className="border p-1 w-20 text-black"
          />
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        {Object.keys(raw.channels).map((ch) => (
          <label key={ch} className="inline-flex items-center text-black">
            <input
              type="checkbox"
              checked={selected[ch]}
              onChange={() =>
                setSelected((prev) => ({ ...prev, [ch]: !prev[ch] }))
              }
            />
            <span className="ml-1 capitalize">{ch}</span>
          </label>
        ))}
      </div>
      <div className="w-full max-w-4xl h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
