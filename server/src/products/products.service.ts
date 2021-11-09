import { Prisma } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return await this.prismaService.product.create({ data });
  }

  async findAllByUser(userId: number, filterDeleted: boolean) {
    return await this.prismaService.product.findMany({
      where: { userId, ...(filterDeleted && { active: filterDeleted }) },
      include: {
        images: {
          select: {
            imageId: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAll(filterDeleted: boolean) {
    return await this.prismaService.product.findMany({
      ...(filterDeleted && { where: { active: filterDeleted } }),
      include: {
        images: {
          select: {
            imageId: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const product = await this.prismaService.product.findMany({
      where: { id, userId },
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
    if (product.length >= 0) {
      return product[0];
    }
    throw new UnauthorizedException('Resource not allowed');
  }

  async update(
    id: number,
    updateProduct: Omit<Prisma.ProductUpdateInput, 'images'> & {
      images?: { imageId: number }[];
    },
    userId: number,
  ) {
    const product = await this.findOne(id, userId);

    const deletedImages =
      product.images?.filter(
        (i) => !updateProduct.images.includes({ imageId: i.imageId }),
      ) || [];

    const newImages =
      updateProduct.images?.filter(
        (i) => !product.images.includes({ imageId: i.imageId }),
      ) || [];

    return await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        description: updateProduct.description,
        name: updateProduct.name,
        price: updateProduct.price,
        images: {
          deleteMany: deletedImages.map((i) => ({
            imageId: i.imageId,
            productId: id,
          })),
          connectOrCreate: newImages.map((i) => ({
            where: {
              imageId_productId: {
                imageId: i.imageId,
                productId: id,
              },
            },
            create: {
              imageId: i.imageId,
            },
          })),
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.findOne(id, userId);
    return await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        active: false,
      },
    });
  }
}
