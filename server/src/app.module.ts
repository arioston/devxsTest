import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/permissions/permissions.guard';
import { CryptographyModule } from './cryptography/cryptography.module';
import { EmailModule } from './email/email.module';
import { ImagesModule } from './images/images.module';
import { ParameterModule } from './parameter/parameter.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UniqueKeyModule } from './unique-key/unique-key.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.STATIC_FOLDER),
      serveRoot: '/public',
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    CryptographyModule,
    EmailModule,
    UniqueKeyModule,
    ParameterModule,
    ProductsModule,
    ImagesModule,
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
