/** columnar EEG data structure */
export interface EEGRawData {
  /** time points in seconds or ms */
  time: number[] | Float32Array;
  /** one entry per channel */
  channels: {
    [channelName: string]: number[] | Float32Array;
  };
}

