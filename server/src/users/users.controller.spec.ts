import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { EmailModule } from 'src/email/email.module';
import { ParameterModule } from 'src/parameter/parameter.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniqueKeyModule } from 'src/unique-key/unique-key.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CryptographyModule,
        PrismaModule,
        EmailModule,
        ParameterModule,
        UniqueKeyModule,
      ],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
