import type { EEGRawData } from "./types";
import type { ChartData } from "chart.js";

export interface BufferToColumnarOptions {
  /** raw buffer: each row has N values (channels) */
  buffer: number[][];
  /** sampling rate in Hz */
  fs: number;
  /** channel names array length must equal buffer[0].length */
  channelNames: string[];
}

const colorPalette: Record<string, { border: string; background: string }> = {
  excitement: {
    border: "rgb(255, 99, 132)",
    background: "rgba(255, 99, 132, 0.3)",
  },
  valence: {
    border: "rgb(54, 162, 235)",
    background: "rgba(54, 162, 235, 0.3)",
  },
  arousal: {
    border: "rgb(75, 192, 192)",
    background: "rgba(75, 192, 192, 0.3)",
  },
  expectation: {
    border: "rgb(255, 205, 86)",
    background: "rgba(255, 205, 86, 0.3)",
  },
};


export function bufferToColumnar({
  buffer,
  fs,
  channelNames,
}: BufferToColumnarOptions): EEGRawData {
  const n = buffer.length;
  const m = channelNames.length;
  const dt = 1 / fs;

  // allocate time array and channel arrays
  const time = new Float32Array(n);
  const channels: Record<string, Float32Array> = {};
  for (const name of channelNames) {
    channels[name] = new Float32Array(n);
  }

  // fill time[] and channels[...] in one nested loop
  for (let i = 0; i < n; i++) {
    time[i] = i * dt;
    const row = buffer[i];
    for (let j = 0; j < m; j++) {
      channels[channelNames[j]][i] = row[j];
    }
  }

  return { time, channels };
}

/**
 * parseEEGColumnar
 * Convert columnar EEGRawData into Chart.js line chart data
 */


export function parseEEGColumnar(raw: EEGRawData): ChartData<"line"> {
  const { time, channels } = raw;

  const labels = Array.from(time).map((t) => `${t.toFixed(1)}s`);

  const datasets = Object.entries(channels).map(([name, arr]) => {
    const { border, background } = colorPalette[name] || {
      border: "#888",
      background: "rgba(136,136,136,0.3)",
    };
    return {
      label: name,
      data: Array.from(arr),
      fill: false,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: background,
    };
  });

  return { labels, datasets };
}