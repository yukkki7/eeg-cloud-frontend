import { bufferToColumnar } from "./parseEEG";
import type { EEGRawData } from "./types";

/**
 * mock6DBuffer
 * Raw buffer with 6 channels per row (4 original metrics + 2 extra channels)
 * Values randomized in [0, 1)
 */
export const mock6DBuffer: number[][] = Array.from({ length: 60 }, () =>
  Array.from({ length: 6 }, () => Math.random())
);

/**
 * channelNames6D
 * First four are original channels; E/F are placeholders for extras
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
 * mock6D
 * Columnar EEG data with 6 dimensions, sampling at 1 Hz (1 second per point)
 */
export const mock6D: EEGRawData = bufferToColumnar({
  buffer: mock6DBuffer,
  fs: 1,
  channelNames: channelNames6D,
});
