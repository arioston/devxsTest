import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniqueKeyService } from './unique-key.service';

describe('UniqueKeyService', () => {
  let service: UniqueKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UniqueKeyService],
    }).compile();

    service = module.get<UniqueKeyService>(UniqueKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
