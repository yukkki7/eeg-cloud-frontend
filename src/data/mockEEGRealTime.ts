import { bufferToColumnar } from "./parseEEG";
import type { EEGRawData } from "./types";

/**
 * mockRealtimeBuffer
 * Raw buffer with 6 channels per row (4 original metrics + 2 extra channels).
 * Values randomized in [0, 10).
 */
export const mockRealtimeBuffer: number[][] = Array.from({ length: 60 }, () =>
  Array.from({ length: 6 }, () => Math.random() * 10)
);

/**
 * channelNames6D
 * First four are original channels; E/F are extra placeholders.
 */
export const channelNames6D: [
  "excitement",
  "valence",
  "arousal",
  "expectation",
  string,
  string
] = ["excitement", "valence", "arousal", "expectation", "E", "F"];

/**
 * mockRealtimeEEG
 * Columnar EEG data with 6 dimensions, sampled at 1 Hz (1 second per point).
 */
export const mockRealtimeEEG: EEGRawData = bufferToColumnar({
  buffer: mockRealtimeBuffer,
  fs: 1,
  channelNames: channelNames6D,
});
