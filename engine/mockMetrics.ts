import { Metrics } from './types';

export const postureLow: Metrics = {
  presenceScore: 72,
  postureScore: 61,
  lightingScore: 80,
};

export const lightingLow: Metrics = {
  presenceScore: 68,
  postureScore: 82,
  lightingScore: 55,
};

export const strongLook: Metrics = {
  presenceScore: 84,
  postureScore: 85,
  lightingScore: 88,
};

export const presets = { postureLow, lightingLow, strongLook };

export type PresetName = keyof typeof presets;
