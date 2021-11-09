import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/permissions/permissions.decorator';
import { Role } from 'src/auth/permissions/permissions.enum';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';
import { ProductsService } from './products.service';
import { Request } from 'express';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Req() request: Request, @Body() createProductDto: CreateProductDto) {
    const user = request.user;
    return this.productsService.create({
      description: createProductDto.description,
      name: createProductDto.name,
      price: createProductDto.price,
      createdBy: { connect: { email: user.email } },
      publishedAt: new Date(),
    });
  }

  @Get()
  findAll(
    @Query('filterDeleted') filterDeleted = true,
    @Req() request: Request,
  ) {
    const user = request.user;
    return user.role === Role.Guest
      ? this.productsService.findAllByUser(user.id, filterDeleted)
      : this.productsService.findAll(filterDeleted);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    const user = request.user;
    return this.productsService.findOne(+id, user.id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.productsService.update(+id, updateProductDto, user.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = request.user;
    return this.productsService.remove(+id, user.id);
  }
}
