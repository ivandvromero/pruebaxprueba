import { DaleNotificationPayload } from './dale-notification.dto';

describe('DaleNotificationDto', () => {
  it('should be defined', () => {
    expect(new DaleNotificationPayload()).toBeDefined();
  });
});
