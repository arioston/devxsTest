import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

import { ProductsController } from './products.controller';
import { ProductsModule } from './products.module';
import { ProductsService } from './products.service';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZXZ4dGVzdEBnbWFpbC5jb20iLCJuYW1lIjoiZGV2eCBhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzNjQzMTg1NywiZXhwIjoxNjUxMDMxODU3fQ.FcnWi7vbbHF60RSZSd1HSe3_lgHhkV6UXopfOAttfYM';

describe('ProductsController', () => {
  let app: INestApplication;

  const mockPrismaService = {
    product: {
      findMany: jest.fn().mockResolvedValue([
        {
          name: 'TV',
          description: "TV 22'",
          price: '2.1',
          publisheAt: '2021-11-09 04:25:29.328',
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({
        name: 'TV',
        description: "TV 22'",
        price: '2.1',
        publisheAt: '2021-11-09 04:25:29.328',
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

  const product = {
    name: 'TV',
    description: "TV 22'",
    price: '2.1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule, PrismaModule, AuthModule],
      providers: [ProductsService],
      controllers: [ProductsController],
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

  it('/Post product', () => {
    return request(app.getHttpServer())
      .post('/products')
      .withCredentials()
      .auth(token, { type: 'bearer' })
      .send(product)
      .expect(201, {
        name: 'TV',
        description: "TV 22'",
        price: '2.1',
        publisheAt: '2021-11-09 04:25:29.328',
      });
  });

  it('/Post product without token should return 401', () => {
    return request(app.getHttpServer()).post('/products').expect(401);
  });

  it('/Get products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .withCredentials()
      .auth(token, { type: 'bearer' })
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([
          {
            name: 'TV',
            description: "TV 22'",
            price: '2.1',
            publisheAt: '2021-11-09 04:25:29.328',
          },
        ]);
      });
  });

  it('/Get products without token should return 401', () => {
    return request(app.getHttpServer()).get('/products').expect(401);
  });

  it('/GET product 1', () => {
    return request(app.getHttpServer())
      .get('/products/1')
      .withCredentials()
      .auth(token, { type: 'bearer' })
      .expect((res) => {
        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
          where: { email: 'devxtest@gmail.com' },
        });
        expect(res.status).toEqual(200);
        expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
          where: { id: 1, userId: 1 },
          select: {
            id: true,
            description: true,
            createdBy: true,
            name: true,
            userId: true,
            images: {
              select: {
                imageId: true,
              },
            },
          },
        });
      });
  });

  it('/GET product 1 without token should return 401', () => {
    return request(app.getHttpServer()).get('/products/1').expect(401);
  });
});
