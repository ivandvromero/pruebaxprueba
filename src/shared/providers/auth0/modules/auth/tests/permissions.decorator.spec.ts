import { Permissions } from '../permissions.decorator';

describe('Permission decorator', () => {
  it('should set permissions data', () => {
    const permissions = 'permission:read';
    expect(Permissions(permissions)).toBeDefined();
  });
});
