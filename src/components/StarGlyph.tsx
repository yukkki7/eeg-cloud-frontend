// src/components/StarGlyph.tsx
"use client";

import React, { FC, ReactElement } from "react";
import type { ChartData } from "chart.js";

export interface StarGlyphProps {
  /** The EEG data parsed columnar (labels + datasets) */
  data: ChartData<"line">;
  /** Optional subset of dimension names to draw (default = all) */
  channels?: string[];
  /** Size in pixels of the SVG (both width & height) */
  size?: number;
}

export const StarGlyph: FC<StarGlyphProps> = ({
  data,
  channels,
  size = 300,
}): ReactElement => {
  // Extract full labels & first dataset values
  const allLabels = (data.labels ?? []) as string[];
  const rawValues = (data.datasets[0]?.data ?? []) as number[];

  // Determine which dimensions to draw
  const dims = channels && channels.length > 0 ? channels : allLabels;
  // Indexes of chosen dims in the original labels
  const idxs = dims.map((d) => allLabels.indexOf(d)).filter((i) => i >= 0);
  // Corresponding values
  const values = idxs.map((i) => rawValues[i]);

  const N = dims.length;
  const angleStep = (2 * Math.PI) / N;
  const center = size / 2;
  const radius = center * 0.8; // leave some padding

  // Precompute the polygon points
  const points = values.map((v, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = v * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  // Build axis lines and grid circles
  const axes = dims.map((_, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return (
      <line
        key={`axis-${i}`}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        stroke="#ccc"
        strokeWidth={1}
      />
    );
  });

  const grid = Array.from({ length: 5 }, (_, k) => {
    const r = ((k + 1) / 5) * radius;
    return (
      <circle
        key={`grid-${k}`}
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="#eee"
        strokeWidth={1}
      />
    );
  });

  // Labels around the edges
  const labels = dims.map((d, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = center + (radius + 12) * Math.cos(angle);
    const y = center + (radius + 12) * Math.sin(angle);
    return (
      <text
        key={`label-${i}`}
        x={x}
        y={y}
        fill="#333"
        fontSize={12}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {d}
      </text>
    );
  });

  return (
    <svg width={size} height={size}>
      {/* Draw concentric grid and axes */}
      {grid}
      {axes}
      {labels}

      {/* Draw the filled petal polygon */}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(75,192,75,0.3)"
        stroke="rgba(75,192,75,1)"
        strokeWidth={2}
      />

      {/* Draw points at each vertex */}
      {points.map((p, i) => (
        <circle
          key={`pt-${i}`}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="rgba(75,192,75,1)"
        />
      ))}
    </svg>
  );
};
