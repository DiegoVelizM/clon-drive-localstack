import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.uploadFiles(files);
  }

  @Get('recent')
  getRecentFiles(@Query('limit') limit?: string) {
    return this.filesService.getRecentFiles(Number(limit) || 3);
  }

  @Get('download/:key')
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    const file = await this.filesService.downloadFile(key);

    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);

    if (file.ContentType) {
      res.setHeader('Content-Type', file.ContentType);
    }

    const stream = file.Body as NodeJS.ReadableStream;
    stream.pipe(res);
  }
}