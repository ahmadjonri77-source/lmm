import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) { }

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
          return cb(null, './src/uploads/temp');
        }
      },
      filename: (req, file, cb) => {
        let type = "mp4"
        console.log(file);

        if (file.mimetype.startsWith('image/')) {
          type = file.mimetype.split("/")[1]
        }
        const filename = new Date().getTime() + "." + type
        cb(null, filename)
        console.log(filename);

      }
    })
  }))


  create(
    @Body() createHomeworkDto: CreateHomeworkDto,
    @UploadedFile() file?: Express.Multer.File) {
    return this.homeworkService.createHomework(createHomeworkDto, file?.filename);
  }

  @Get("all")
  getAllHomeworks() {
    return this.homeworkService.getAllHomeworks();
  }

  @Get("one/:id")
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.findOne(id);
  }

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
          return cb(null, './src/uploads/temp');
        }
      },
      filename: (req, file, cb) => {
        let type = "mp4"
        console.log(file);

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

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.homeworkService.remove(id);
  }
}
