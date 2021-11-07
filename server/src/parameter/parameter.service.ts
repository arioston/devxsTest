import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParameterService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(key: string) {
    return await this.prismaService.parameter.findUnique({ where: { key } });
  }
}
