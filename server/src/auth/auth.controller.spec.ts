import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
