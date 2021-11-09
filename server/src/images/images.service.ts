import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ImageCreateInput) {
    return await this.prismaService.image.create({ data });
  }

  async findAll() {
    return await this.prismaService.image.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.image.findUnique({ where: { id } });
  }

  async update(id: number, updateImageDto: Prisma.ImageUpdateInput) {
    return await this.prismaService.image.update({
      where: { id },
      data: {
        fileName: updateImageDto.fileName,
        filePath: updateImageDto.filePath,
      },
    });
  }

  async remove(id: number) {
    await this.prismaService
      .$queryRaw`DELETE FROM "ImageOnProducs" WHERE "imageId" = ${id};`;
    const image = await this.prismaService.image.delete({ where: { id } });

    unlink(join(image.filePath, image.fileName), (err) => {
      if (err) {
        this.logger.error(err);
      } else {
        this.logger.debug(`file ${image.fileName} deleted`);
      }
    });
    return image;
  }
}
