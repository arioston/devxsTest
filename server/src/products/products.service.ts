import { Prisma } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return await this.prismaService.product.create({ data });
  }

  async findAllByUser(userId: number) {
    return await this.prismaService.product.findMany({ where: { userId } });
  }

  async findAll() {
    return await this.prismaService.product.findMany();
  }

  async findOne(id: number, userId: number) {
    const product = await this.prismaService.product.findMany({
      where: { id, userId },
    });
    if (product.length >= 0) {
      return product[0];
    }
    throw new UnauthorizedException('Resource not allowed');
  }

  async update(
    id: number,
    updateProduct: Omit<Prisma.ProductUpdateInput, 'images'>,
    userId: number,
  ) {
    const product = await this.findOne(id, userId);
    return await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        description: updateProduct.description,
        name: updateProduct.name,
        price: updateProduct.price,
      },
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.findOne(id, userId);
    return await this.prismaService.product.delete({
      where: { id: product.id },
    });
  }
}
