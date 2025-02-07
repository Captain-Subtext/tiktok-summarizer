import { VideoStatus } from '../types/video';

const VALID_TRANSITIONS = {
  queued: ['processing'],
  processing: ['stalled', 'completed', 'failed'],
  stalled: ['processing', 'failed'],
  completed: ['archived'],
  failed: ['queued', 'deleted'],
  archived: ['deleted'],
  deleted: []
} as const;

export function validateStatusTransition(
  from: VideoStatus,
  to: VideoStatus
): boolean {
  const validNextStates = VALID_TRANSITIONS[from];
  if (!validNextStates) return false;
  return validNextStates.includes(to);
}

export class InvalidStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Invalid status transition from ${from} to ${to}`);
    this.name = 'InvalidStatusTransitionError';
  }
} 