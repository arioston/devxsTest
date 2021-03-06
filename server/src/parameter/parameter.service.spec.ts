import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParameterService } from './parameter.service';

describe('ParameterService', () => {
  let service: ParameterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ParameterService],
    }).compile();

    service = module.get<ParameterService>(ParameterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
