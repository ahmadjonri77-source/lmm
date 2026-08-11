import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }

  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        sectionId: { type: "number" },
        description: { type: "string" },
        file: { format: "binary", type: "string" },
      }
    }
  })
  @Post()
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads/videos",
      filename: (req, file, cb) => {
        const filename = new Date().getTime() + ".mp4"
        cb(null, filename)
      }
    })
  }))

  async createLesson(
    @Body() payload: CreateLessonDto,
    @UploadedFile() file: Express.Multer.File

  ) {

    try {
      return await this.lessonService.createLesson(payload, file.filename);
    } catch (error) {
      if (file) {
        await unlink(file.path).catch(() => { });
      }
      throw error;
    }
  }

  @Get("all")
  findAllLessons() {
    return this.lessonService.findAllLessons();
  }

  @Get("one/:id")
  async findOneLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.findOneLesson(id);
  }

  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        sectionId: { type: "number" },
        description: { type: "string" },
        file: { format: "binary", type: "string" },
      }
    }
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads/videos",
      filename: (req, file, cb) => {
        const filename = new Date().getTime() + ".mp4"
        cb(null, filename)
      }
    })
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLessonDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return this.lessonService.update(id, payload, file?.filename);
    } catch (error) {
      if (file) {
        await unlink(join(process.cwd(), file.path)).catch(() => { })
      }
      throw error

    }
  }

  @Delete(':id')
  deleteLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.deleteLesson(id);
  }
}
