import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniqueKeyService } from './unique-key.service';

@Module({
  imports: [PrismaModule],
  providers: [UniqueKeyService],
  exports: [UniqueKeyService],
})
export class UniqueKeyModule {}
