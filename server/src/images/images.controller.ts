import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';
import { ApiMultiFile } from './multifile.decorator';

@ApiTags('images')
@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.create({
      fileName: file.filename,
      filePath: file.destination,
    });
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
