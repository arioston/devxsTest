import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { EmailModule } from 'src/email/email.module';
import { ParameterModule } from 'src/parameter/parameter.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniqueKeyModule } from 'src/unique-key/unique-key.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

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
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
