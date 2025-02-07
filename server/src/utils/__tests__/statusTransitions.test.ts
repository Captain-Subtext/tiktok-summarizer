import { validateStatusTransition } from '../statusTransitions';

describe('validateStatusTransition', () => {
  // Valid transitions
  test('allows queued -> processing', () => {
    expect(validateStatusTransition('queued', 'processing')).toBe(true);
  });

  test('allows processing -> completed', () => {
    expect(validateStatusTransition('processing', 'completed')).toBe(true);
  });

  test('allows stalled -> processing', () => {
    expect(validateStatusTransition('stalled', 'processing')).toBe(true);
  });

  // Invalid transitions
  test('prevents queued -> completed', () => {
    expect(validateStatusTransition('queued', 'completed')).toBe(false);
  });

  test('prevents completed -> processing', () => {
    expect(validateStatusTransition('completed', 'processing')).toBe(false);
  });

  test('prevents deleted -> any status', () => {
    expect(validateStatusTransition('deleted', 'processing')).toBe(false);
    expect(validateStatusTransition('deleted', 'completed')).toBe(false);
  });
}); 