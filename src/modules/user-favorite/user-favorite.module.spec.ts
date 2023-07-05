import { Test } from '@nestjs/testing';

import { UserFavoritesModule } from './user-favorite.module';

describe('ThingsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [UserFavoritesModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
