import { Test } from '@nestjs/testing';

import { FavoriteDbModule } from './favorite.module';

describe('ThingsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [FavoriteDbModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
