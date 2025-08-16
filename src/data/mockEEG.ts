// src/data/mockEEG.ts
import { bufferToColumnar } from "./parseEEG";
import type { EEGRawData } from "./types";

// Generate a mock raw buffer: 60 rows × 4 channels.
// MODIFIED: Values now range from [0, 100) instead of [0, 1).
const rawBuffer: number[][] = Array.from({ length: 60 }, () =>
  Array.from({ length: 4 }, () => Math.random() * 100)
);

const channelNames = ["excitement", "valence", "arousal", "expectation"];

// convert to columnar EEGRawData at 1 Hz sampling
export const mockEEG: EEGRawData = bufferToColumnar({
  buffer: rawBuffer,
  fs: 1,
  channelNames,
});
