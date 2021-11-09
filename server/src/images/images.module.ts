import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [
    PrismaModule,
    MulterModule.registerAsync({
      useFactory: async () => ({
        dest: join(process.cwd(), process.env.STATIC_FOLDER),
        storage: diskStorage({
          destination: join(process.cwd(), process.env.STATIC_FOLDER),
          filename: (req, file, cb) => {
            // Generating a 32 random chars long string
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            //Calling the callback passing the random name generated with the original extension name
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
