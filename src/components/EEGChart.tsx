// src/components/EEGChart.tsx
"use client";
import { FC, useState } from "react";
import { Line } from "react-chartjs-2";
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
import type { ChartData } from "chart.js";
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
  // parse columnar data
  const rawData: EEGRawData = mockEEG;
  const parsed = parseEEGColumnar(rawData);
  // destructure to ensure labels and datasets are defined
  const labels = parsed.labels as string[];
  const datasetsAll = parsed.datasets;

  const allChannels = Object.keys(rawData.channels);

  // channel selection state
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(allChannels.map((ch) => [ch, true]))
  );

  // time window state: start time in seconds
  const [startSec, setStartSec] = useState(0);
  const windowLength = 10; // 10 seconds window

  // handle start input change
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxStart = labels.length - windowLength;
    const val = Math.max(0, Math.min(maxStart, Number(e.target.value)));
    setStartSec(val);
  };

  // filter and slice data
  const filteredDatasets = datasetsAll
    .filter((ds) => selected[ds.label as string])
    .map((ds) => ({
      ...ds,
      data: (ds.data as number[]).slice(startSec, startSec + windowLength),
    }));

  const windowLabels = labels.slice(startSec, startSec + windowLength);

  const data: ChartData<"line"> = {
    labels: windowLabels,
    datasets: filteredDatasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { color: "black" } },
      title: { display: true, text: "EEG Metrics Over Time", color: "black" },
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
    <div className="flex flex-col items-center justify-center">
      {/* time window input */}
      <div className="mb-4">
        <label className="mr-2 text-black font-medium">Start Second:</label>
        <input
          type="number"
          min={0}
          max={labels.length - windowLength}
          value={startSec}
          onChange={handleStartChange}
          className="border p-1 w-16"
        />
      </div>

      {/* channel selection */}
      <div className="mb-4 flex space-x-4 justify-center">
        {allChannels.map((ch) => (
          <label
            key={ch}
            className="inline-flex items-center space-x-2 text-black"
          >
            <input
              type="checkbox"
              checked={selected[ch]}
              onChange={() =>
                setSelected((prev) => ({ ...prev, [ch]: !prev[ch] }))
              }
            />
            <span className="capitalize text-black font-medium">{ch}</span>
          </label>
        ))}
      </div>

      {/* chart */}
      <div className="w-full max-w-4xl h-96 mx-auto">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
