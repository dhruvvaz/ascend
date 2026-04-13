import { Metrics, CoachingTip } from './types';

export function getCoachingTip(metrics: Metrics): CoachingTip {
  if (metrics.postureScore < 70) {
    return 'Straighten your posture';
  } else if (metrics.lightingScore < 70) {
    return 'Move toward better lighting';
  } else {
    return 'Hold this look';
  }
}
