import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CryptographyModule } from './cryptography/cryptography.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UniqueKeyModule } from './unique-key/unique-key.module';
import { ParameterModule } from './parameter/parameter.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/permissions/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    PrismaModule,
    CryptographyModule,
    EmailModule,
    UniqueKeyModule,
    ParameterModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
