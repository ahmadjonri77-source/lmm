import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorator/role';


@ApiBearerAuth('access-token')
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }


  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
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

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("all")
  findAllLessons() {
    return this.lessonService.findAllLessons();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("one/:id")
  async findOneLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.findOneLesson(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
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

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(':id')
  deleteLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.deleteLesson(id);
  }
}
