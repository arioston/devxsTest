import { Injectable, Logger } from '@nestjs/common';
import { UniqueKey } from '@prisma/client';
import { add, isAfter } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniqueKeyService {
  private readonly logger = new Logger(UniqueKeyService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    return this.prismaService.uniqueKey.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  isUniqueKeyExired(uniqueKey: UniqueKey, deltaTime: number) {
    const timePlusDelta = add(uniqueKey.createdAt, { seconds: deltaTime });
    return isAfter(new Date(), timePlusDelta);
  }
}
