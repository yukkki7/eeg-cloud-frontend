// src/components/HistoryPanel.tsx
"use client";

import React, { FC, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import type {
  ChartData,
  ChartOptions,
  ChartEvent,
  ActiveElement,
} from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const HistoryPanel: FC = () => {
  // Granularity options
  type Granularity = "year" | "month" | "week" | "day";
  const [granularity, setGranularity] = useState<Granularity>("year");

  // Reference date in ISO format
  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  // Chart data state
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  // Random integer helper
  const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min);

  // Recompute chart data when granularity or date changes
  useEffect(() => {
    const base = new Date(selectedDate);
    let labels: string[] = [];
    let data: number[] = [];

    switch (granularity) {
      case "year":
        labels = Array.from({ length: 12 }, (_, i) =>
          new Date(base.getFullYear(), i, 1).toLocaleString("default", {
            month: "short",
          })
        );
        data = labels.map(() => randInt(0, 100));
        break;

      case "month": {
        const year = base.getFullYear(),
          month = base.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weekCount = Math.ceil((daysInMonth + firstDay) / 7);
        labels = Array.from({ length: weekCount }, (_, i) => `Week ${i + 1}`);
        data = labels.map(() => randInt(0, 100));
        break;
      }

      case "week": {
        const dayOfWeek = (base.getDay() + 6) % 7; // 0=Mon
        const monday = new Date(base);
        monday.setDate(base.getDate() - dayOfWeek);
        labels = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          return d.toLocaleDateString("default", {
            weekday: "short",
            day: "numeric",
          });
        });
        data = labels.map(() => randInt(0, 100));
        break;
      }

      case "day":
        const sessions = randInt(3, 8);
        labels = Array.from({ length: sessions }, (_, i) => `Game ${i + 1}`);
        data = labels.map(() => randInt(0, 100));
        break;
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Score",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  }, [granularity, selectedDate]);

  // Chart.js options with drill-down on click
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "black" } },
      title: { display: false },
    },
    onClick: (evt: ChartEvent, elements: ActiveElement[]) => {
      if (!elements.length) return;
      const idx = elements[0].index;
      const base = new Date(selectedDate);
      let newGran = granularity;
      let newDate = selectedDate;

      if (granularity === "year") {
        newGran = "month";
        const m = idx + 1;
        newDate = `${base.getFullYear()}-${String(m).padStart(2, "0")}-01`;
      } else if (granularity === "month") {
        newGran = "week";
        const y = base.getFullYear(),
          mo = base.getMonth();
        const firstDay = new Date(y, mo, 1).getDay();
        const monday = new Date(y, mo, 1);
        const offset = ((firstDay + 6) % 7) * -1 + idx * 7;
        monday.setDate(monday.getDate() + offset);
        newDate = monday.toISOString().slice(0, 10);
      } else if (granularity === "week") {
        newGran = "day";
        const dayOfWeek = (base.getDay() + 6) % 7;
        const monday = new Date(base);
        monday.setDate(base.getDate() - dayOfWeek + idx);
        newDate = monday.toISOString().slice(0, 10);
      }

      if (newGran !== granularity) {
        setGranularity(newGran);
        setSelectedDate(newDate);
      }
    },
  };

  return (
    <div className="bg-gray-50 w-full max-w-4xl mx-auto p-4 rounded-lg shadow-sm space-y-6">
      {/* Header + controls */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-black">History</h3>

        <div className="flex items-center gap-4 text-black">
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as Granularity)}
            className="border p-1 text-black"
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>

          {granularity === "year" ? (
            <input
              type="number"
              min={2000}
              max={2100}
              value={selectedDate.slice(0, 4)}
              onChange={(e) => setSelectedDate(e.target.value + "-01-01")}
              className="border p-1 w-24 text-black"
            />
          ) : granularity === "month" ? (
            <input
              type="month"
              value={selectedDate.slice(0, 7)}
              onChange={(e) => setSelectedDate(e.target.value + "-01")}
              className="border p-1 text-black"
            />
          ) : granularity === "week" ? (
            <input
              type="week"
              value={selectedDate.slice(0, 8)}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-1 text-black"
            />
          ) : (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-1 text-black"
            />
          )}
        </div>
      </div>

      {/* Chart area exactly matching your EEG graph size */}
      <div className="h-[28rem]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
