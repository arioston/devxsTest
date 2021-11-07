import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParameterService } from './parameter.service';

@Module({
  imports: [PrismaModule],
  providers: [ParameterService],
  exports: [ParameterService],
})
export class ParameterModule {}
