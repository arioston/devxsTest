import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';

export class CreateProductDto {
  @ApiProperty({ example: 'TV', description: 'The name of the product' })
  name: string;
  @ApiProperty({
    example: 'some text',
    description: 'The description of the product',
  })
  description: string;
  @ApiProperty({ example: '3.12', description: 'The value of the product' })
  price: Decimal;
  @ApiProperty({
    example: '30/10/2021',
    description: 'The data of publication',
  })
  publishedAt: Date | string;
  images?: { imageId: number }[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
