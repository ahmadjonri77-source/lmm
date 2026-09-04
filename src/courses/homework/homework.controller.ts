import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/common/decorator/role';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { VideoService } from 'src/common/utils/video.service';
import { convertHeic } from 'src/common/utils/image.util';

@ApiBearerAuth('access-token')
@Controller('homework')
export class HomeworkController {
  constructor(
    private readonly homeworkService: HomeworkService,
    private readonly videoService: VideoService
  ) { }

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
        lessonId: { type: "number" },
        description: { type: "string" },
        file: { format: "binary", type: "string" }

      }
    }
  })
  @Post()
  @UseInterceptors(FileInterceptor("file", {

    storage: diskStorage({
      destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          return cb(null, './src/uploads/images');
        }

        if (file.mimetype.startsWith('video/')) {
          return cb(null, './src/uploads/videos');
        }
        return cb(null, './src/uploads/videos');
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();

        const filename = `${Date.now()}.${ext}`;

        cb(null, filename);
      },
    })
  }))


  async create(
    @Body() createHomeworkDto: CreateHomeworkDto,
    @UploadedFile() file?: Express.Multer.File) {
    let filename = file?.filename;

    if (file?.mimetype.startsWith('video/')) {
      const inputPath = file.path;

      filename = await this.videoService.convertToMp4(inputPath);
    }
    if (file?.mimetype.startsWith('image/')) {
      filename = file ? await convertHeic(file) : undefined
    }
    return this.homeworkService.createHomework(createHomeworkDto, filename);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("all")
  getAllHomeworks() {
    return this.homeworkService.getAllHomeworks();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("one/:id")
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.findOne(id);
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
        lessonId: { type: "number" },
        description: { type: "string" },
        file: { format: "binary", type: "string" }
      }
    }
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          return cb(null, './src/uploads/images');
        }

        if (file.mimetype.startsWith('video/')) {
          return cb(null, './src/uploads/videos');
        }
      },
      filename: (req, file, cb) => {
        let type = "mp4"

        if (file.mimetype.startsWith('image/')) {
          type = file.mimetype.split("/")[1]
        }
        const filename = new Date().getTime() + "." + type
        cb(null, filename)
        console.log(filename);

      }
    })
  }))
  updateHomework(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeworkDto: UpdateHomeworkDto,
    @UploadedFile() file?: Express.Multer.File) {
    return this.homeworkService.updateHomework(id, updateHomeworkDto, file?.filename);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.remove(id);
  }
}
