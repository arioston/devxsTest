import { Module } from '@nestjs/common';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { EmailModule } from 'src/email/email.module';
import { ParameterModule } from 'src/parameter/parameter.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniqueKeyModule } from 'src/unique-key/unique-key.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    CryptographyModule,
    PrismaModule,
    EmailModule,
    ParameterModule,
    UniqueKeyModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
