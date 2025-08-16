// src/app/echarts-multi/page.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";

export default function EChartsAllPage() {
  // Refs for each chart container
  const lineRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const scatterRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Initialize Line Chart
  useEffect(() => {
    if (!lineRef.current) return;
    const chart = echarts.init(lineRef.current);
    chart.setOption({
      title: { text: "EEG Signal Over Time", left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: Array.from({ length: 60 }, (_, i) => `${i}s`),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Channel 1",
          type: "line",
          data: Array.from(
            { length: 60 },
            () => +(Math.random() * 10).toFixed(2)
          ),
          smooth: true,
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, []);

  // Initialize Pie Chart
  useEffect(() => {
    if (!pieRef.current) return;
    const chart = echarts.init(pieRef.current);
    chart.setOption({
      title: { text: "EEG Feature Distribution", left: "center" },
      tooltip: { trigger: "item" },
      legend: { top: 30 },
      series: [
        {
          name: "Features",
          type: "pie",
          radius: "50%",
          data: [
            { value: 25, name: "Excitement" },
            { value: 20, name: "Valence" },
            { value: 15, name: "Arousal" },
            { value: 20, name: "Expectation" },
            { value: 10, name: "Channel E" },
            { value: 10, name: "Channel F" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0,0,0,0.5)",
            },
          },
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, []);

  // Initialize Scatter Chart
  useEffect(() => {
    if (!scatterRef.current) return;
    const chart = echarts.init(scatterRef.current);
    const data = Array.from({ length: 100 }, () => [
      +(Math.random() * 10).toFixed(2),
      +(Math.random() * 10).toFixed(2),
    ]);
    chart.setOption({
      title: { text: "EEG Channels Scatter", left: "center" },
      tooltip: {},
      xAxis: { name: "Channel A", type: "value" },
      yAxis: { name: "Channel B", type: "value" },
      series: [
        {
          symbolSize: 8,
          data,
          type: "scatter",
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, []);

  // Initialize Radar Chart
  useEffect(() => {
    if (!radarRef.current) return;
    const chart = echarts.init(radarRef.current);
    chart.setOption({
      title: {
        text: "EEG Metrics Radar",
        left: "center",
      },
      tooltip: {},
      legend: {
        data: ["Subject A", "Subject B"],
        top: 30,
      },
      radar: {
        shape: "polygon",
        indicator: [
          { name: "Excitement", max: 10 },
          { name: "Valence", max: 10 },
          { name: "Arousal", max: 10 },
          { name: "Expectation", max: 10 },
          { name: "Channel E", max: 10 },
          { name: "Channel F", max: 10 },
        ],
      },
      series: [
        {
          name: "EEG Metrics",
          type: "radar",
          data: [
            {
              value: [6, 8, 7, 5, 4, 9],
              name: "Subject A",
              areaStyle: { opacity: 0.3 },
            },
            {
              value: [5, 4, 6, 7, 8, 5],
              name: "Subject B",
              areaStyle: { opacity: 0.3 },
            },
          ],
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, []);

  // Initialize History (Bar) Chart
  useEffect(() => {
    if (!historyRef.current) return;
    const chart = echarts.init(historyRef.current);
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = labels.map(() => Math.round(Math.random() * 80 + 5));
    chart.setOption({
      title: { text: "History (Yearly)", left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: labels,
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Score",
          type: "bar",
          data,
          itemStyle: { color: "rgba(0,200,150,0.6)" },
        },
      ],
    });
    chart.on("click", (params) => {
      console.log("Clicked bar index:", params.dataIndex);
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, []);

  return (
    <div className="w-full px-4 py-6 space-y-12">
      {/* Line Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Line Chart</h2>
        <div ref={lineRef} className="w-full h-[300px] bg-white rounded" />
      </section>

      {/* Pie Chart */}
      {/* <section>
        <h2 className="text-xl font-semibold mb-2">Pie Chart</h2>
        <div ref={pieRef} className="w-full h-[300px] bg-white rounded" />
      </section> */}

      {/* Scatter Chart */}
      {/* <section>
        <h2 className="text-xl font-semibold mb-2">Scatter Chart</h2>
        <div ref={scatterRef} className="w-full h-[300px] bg-white rounded" />
      </section> */}

      {/* Radar Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Radar Chart</h2>
        <div ref={radarRef} className="w-full h-[300px] bg-white rounded" />
      </section>

      {/* History Bar Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-2">History Bar Chart</h2>
        <div ref={historyRef} className="w-full h-[300px] bg-white rounded" />
      </section>
    </div>
  );
}
