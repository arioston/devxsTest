import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import * as request from 'supertest';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import multer from 'multer';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZXZ4dGVzdEBnbWFpbC5jb20iLCJuYW1lIjoiZGV2eCBhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzNjQzMTg1NywiZXhwIjoxNjUxMDMxODU3fQ.FcnWi7vbbHF60RSZSd1HSe3_lgHhkV6UXopfOAttfYM';

jest.mock('multer', () => {
  const multer = () => ({
    single: (fieldName) => {
      return (req, res, next) => {
        req.file = {
          originalname: 'sample.name',
          mimetype: 'sample.type',
          path: 'sample.url',
          filename: 'sample.name',
          destination: 'c:/',
          buffer: Buffer.from('whatever'), // this is required since `formData` needs access to the buffer
        };
        req.files = [req.file];
        req.body.file = req.file;
        return next();
      };
    },
  });
  multer.memoryStorage = () => jest.fn();
  return multer;
});

describe('ImagesController', () => {
  let app: INestApplication;
  const mockPrismaService = {
    image: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({
        fileName: 'teste',
        filePath: 'c:',
        productId: '1',
      }),
      delete: jest.fn().mockResolvedValue({}),
      findAll: jest.fn().mockResolvedValue([]),
    },
    user: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        email: 'devxtest@gmail.com',
        name: 'devx admin',
      }),
      update: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AuthModule,
        UsersModule,
        MulterModule.registerAsync({
          useFactory: async () => ({
            dest: 'public',
            storage: jest.fn(),
          }),
        }),
      ],
      providers: [ImagesService],
      controllers: [ImagesController],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('/Post image', () => {
    return request(app.getHttpServer())
      .post('/images')
      .withCredentials()
      .auth(token, { type: 'bearer' })
      .attach('', Buffer.from('whatever'))
      .expect((res) => {
        expect(res.status).toEqual(201);
        expect(mockPrismaService.image.create).toHaveBeenCalledWith({
          data: {
            fileName: 'sample.name',
            filePath: 'c:/',
          },
        });
      });
  });

  it('/Post image without token should return 401', () => {
    return request(app.getHttpServer()).post('/images').expect(401);
  });
});
