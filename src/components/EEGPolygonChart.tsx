"use client";
import React, { FC, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import { mock6D } from "../data/mockEEG6";
import { parseEEGColumnar } from "../data/parseEEG";
import type { EEGRawData } from "../data/types";

// register modules
// register modules
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const EEGPolygonChart: FC = () => {
  const raw: EEGRawData = mock6D;
  const { labels = [], datasets: allDatasets } = parseEEGColumnar(raw);
  const channelNames = allDatasets.map((ds) => ds.label as string);
  const maxSecs = labels.length - 1;

  // state for channel selection
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(channelNames.map((name) => [name, true]))
  );
  const selectedCount = useMemo(
    () => Object.values(selected).filter((v) => v).length,
    [selected]
  );

  // state for second index
  const [sec, setSec] = useState(maxSecs);

  // handle toggle with min/max enforcement
  const toggleChannel = (name: string) => {
    const isSelected = selected[name];
    // prevent deselect if count <=3
    if (isSelected && selectedCount <= 3) return;
    // prevent select if count >=6
    if (!isSelected && selectedCount >= 6) return;
    setSelected((prev) => ({ ...prev, [name]: !isSelected }));
  };

  const datasets = allDatasets.filter((ds) => selected[ds.label as string]);

  // prepare radar data for selected second
  const radarData: ChartData<"radar"> = {
    labels: datasets.map((ds) => ds.label as string),
    datasets: [
      {
        label: `Values at ${sec}s`,
        data: datasets.map((ds) => (ds.data as number[])[sec]),
        backgroundColor: "rgba(0, 200, 0, 0.3)", // lighter green fill,
        borderColor: "rgba(75, 192, 75, 1)",
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: "rgba(75, 192, 75, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { color: "black" } },
      title: {
        display: true,
        text: `EEG Spectrum at ${sec}s`,
        color: "black" as const,
      },
    },
    scales: {
      r: {
        angleLines: { color: "black" },
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: { display: false },
        pointLabels: { color: "black" },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label className="font-medium text-black">Second:</label>
          <input
            type="number"
            min={0}
            max={maxSecs}
            value={sec}
            onChange={(e) =>
              setSec(Math.max(0, Math.min(maxSecs, Number(e.target.value))))
            }
            className="border p-1 w-20 text-black"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {channelNames.map((name) => (
            <label key={name} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected[name]}
                onChange={() => toggleChannel(name)}
                disabled={
                  (selected[name] && selectedCount <= 3) ||
                  (!selected[name] && selectedCount >= 6)
                }
              />
              <span className="text-black capitalize">{name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* radar chart */}
      <Radar data={radarData} options={options} />
    </div>
  );
};
