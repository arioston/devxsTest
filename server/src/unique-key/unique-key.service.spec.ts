import { Test, TestingModule } from '@nestjs/testing';
import { UniqueKeyService } from './unique-key.service';

describe('UniqueKeyService', () => {
  let service: UniqueKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueKeyService],
    }).compile();

    service = module.get<UniqueKeyService>(UniqueKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
