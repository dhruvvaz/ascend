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

export function getStatusLine(metrics: Metrics): string {
  if (metrics.postureScore < 70) {
    return 'Posture needs attention';
  } else if (metrics.lightingScore < 70) {
    return 'Lighting is holding this back';
  } else {
    return 'This look is working';
  }
}
