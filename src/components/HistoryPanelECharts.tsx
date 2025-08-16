// src/components/HistoryPanelECharts.tsx
"use client";

import React, { FC, useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

// Define a type for a single session's data
type SessionData = {
  label: string;
  score: number;
  time: string; // e.g., "14:35"
};

// NEW: Define a specific type for the ECharts click event parameters
// This resolves the 'no-explicit-any' linting error.
interface EChartsClickParams {
  dataIndex: number;
  // Other properties like 'name', 'value' also exist but are not used here.
}

export const HistoryPanelECharts: FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  // All state management remains the same
  type Granularity = "year" | "month" | "week" | "day";
  const [granularity, setGranularity] = useState<Granularity>("year");
  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [daySessionData, setDaySessionData] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );

  // Helper functions
  const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min);
  const getRandomTime = () => {
    const hour = String(randInt(8, 23)).padStart(2, "0");
    const minute = String(randInt(0, 59)).padStart(2, "0");
    return `${hour}:${minute}`;
  };

  // Main useEffect to render and update the ECharts instance
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    if (granularity !== "day") {
      setSelectedSession(null);
    }

    // --- Data Generation Logic ---
    const base = new Date(selectedDate);
    let labels: string[] = [];
    let data: number[] = [];
    let sessions: SessionData[] = daySessionData;

    switch (granularity) {
      // ... cases for 'year', 'month', 'week' remain the same ...
      case "year":
        labels = Array.from({ length: 12 }, (_, i) =>
          new Date(base.getFullYear(), i, 1).toLocaleString("default", {
            month: "short",
          })
        );
        data = labels.map(() => randInt(0, 100));
        break;
      case "month":
        const year = base.getFullYear(),
          month = base.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weekCount = Math.ceil((daysInMonth + firstDay) / 7);
        labels = Array.from({ length: weekCount }, (_, i) => `Week ${i + 1}`);
        data = labels.map(() => randInt(0, 100));
        break;
      case "week":
        const dayOfWeek = (base.getDay() + 6) % 7;
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
      case "day":
        if (sessions.length === 0) {
          const sessionCount = randInt(3, 8);
          sessions = Array.from({ length: sessionCount }, (_, i) => ({
            label: `Game ${i + 1}`,
            score: randInt(0, 100),
            time: getRandomTime(),
          }));
          setDaySessionData(sessions);
        }
        labels = sessions.map((s) => s.label);
        data = sessions.map((s) => s.score);
        break;
    }

    // ECharts option object
    const option = {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: labels },
      yAxis: { type: "value", name: "Score" },
      series: [
        {
          name: "Score",
          type: "bar",
          data: data.map((value, index) => ({
            value: value,
            itemStyle: {
              color:
                index === selectedBarIndex && granularity === "day"
                  ? "rgba(28, 100, 100, 1)"
                  : "rgba(75, 192, 192, 0.6)",
            },
          })),
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
    };

    chart.setOption(option);

    // MODIFIED: Apply the specific type to the 'params' argument
    const handleClick = (params: EChartsClickParams) => {
      const idx = params.dataIndex;
      if (granularity === "day") {
        setSelectedBarIndex(idx);
        setSelectedSession(sessions[idx]);
      } else {
        let newGranularity: Granularity = granularity;
        let newDate = selectedDate;
        if (granularity === "year") {
          const m = idx + 1;
          newDate = `${base.getFullYear()}-${String(m).padStart(2, "0")}-01`;
          newGranularity = "month";
        } else if (granularity === "month") {
          const y = base.getFullYear(),
            mo = base.getMonth();
          const firstDay = new Date(y, mo, 1).getDay();
          const monday = new Date(y, mo, 1);
          monday.setDate(
            monday.getDate() + ((firstDay + 6) % 7) * -1 + idx * 7
          );
          newDate = monday.toISOString().slice(0, 10);
          newGranularity = "week";
        } else if (granularity === "week") {
          const dayOfWeek = (base.getDay() + 6) % 7;
          const monday = new Date(base);
          monday.setDate(base.getDate() - dayOfWeek + idx);
          newDate = monday.toISOString().slice(0, 10);
          newGranularity = "day";
        }
        setGranularity(newGranularity);
        setSelectedDate(newDate);
        setSelectedBarIndex(null);
        setDaySessionData([]);
      }
    };
    chart.on("click", handleClick);

    // Resize and cleanup
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chart.off("click", handleClick);
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [granularity, selectedDate, selectedBarIndex, daySessionData]);

  return (
    <div className="bg-gray-50 w-full max-w-4xl mx-auto p-4 rounded-lg shadow-sm space-y-6">
      {/* Header + controls */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-black">
          History (ECharts Version)
        </h3>
        <div className="flex items-center gap-4 text-black">
          <select
            value={granularity}
            onChange={(e) => {
              setGranularity(e.target.value as Granularity);
              setSelectedBarIndex(null);
            }}
            className="border p-1 text-black"
          >
            {/* ...options... */}
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          {/* ...date inputs... */}
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

      {/* Chart container */}
      <div ref={chartRef} className="h-[28rem] w-full" />

      {/* Selected session's details */}
      {selectedSession && (
        <div className="mt-4 p-4 border-t border-gray-200 text-center">
          <p className="text-lg text-black">
            {new Date(selectedDate).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
            {" ("}
            <span className="font-semibold">{selectedSession.time}</span>
            {") "}
            <span className="font-semibold">{selectedSession.label}</span>
            {" - "}
            <span className="font-bold">Score: {selectedSession.score}</span>
          </p>
        </div>
      )}
    </div>
  );
};
