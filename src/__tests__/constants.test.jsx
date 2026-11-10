import { defaultlMessageCloseTime } from '../constants';

describe('notification close times', () => {
  test('keeps success notifications visible', () => {
    expect(defaultlMessageCloseTime.success).toBeGreaterThan(0);
  });
});
