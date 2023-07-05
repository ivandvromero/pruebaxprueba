import { Test } from '@nestjs/testing';

import { UserModule } from './user.module';

describe('ThingsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
