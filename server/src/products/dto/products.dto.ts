import { Prisma } from '.prisma/client';
import { PartialType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';

export class CreateProductDto {
  name: string;
  description: string;
  price: Decimal;
  publishedAt: Date | string;
  images?: { id: number }[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
