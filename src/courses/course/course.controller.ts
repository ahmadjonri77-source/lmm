import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { BuyCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CourseLevel, UserRole } from '@prisma/client';
import { unlink } from 'fs/promises';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role';


@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @ApiBearerAuth('access-token')
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
        banner: { format: "binary", type: "string" },
        intro_video: { format: "binary", type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        level: { type: "string", enum: Object.values(CourseLevel) },
        price: { type: "number" },
        categoryId: { type: "integer" },
        mentorId: { type: "integer" },
        assistantId: { type: "integer" },

      }
    }
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: "banner", maxCount: 1 },
    { name: "intro_video", maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === "banner") {
          cb(null, "./src/uploads/images")
        } else if (file.fieldname === "intro_video") {
          cb(null, "./src/uploads/videos")
        }

      },

      filename: (req, file, cb) => {

        const filename = `${Date.now()}${extname(file.originalname).toLowerCase()}`;
        cb(null, filename)
      }

    })

  })
  )

  @Post()
  async createCourse(
    @Body() payload: CreateCourseDto,
    @UploadedFiles() files: {
      banner?: Express.Multer.File[];
      intro_video?: Express.Multer.File[];
    }


  ) {
    try {
      return await this.courseService.createCourse(
        payload,
        files.banner?.[0]?.filename,
        files.intro_video?.[0]?.filename,
      );
    } catch (error) {
      if (files.banner?.[0]) {
        await unlink(files.banner[0].path).catch(() => { });
      }

      if (files.intro_video?.[0]) {
        await unlink(files.intro_video[0].path).catch(() => { });
      }

      throw error;

    }
  }

  @Post("assignedCourse")
  async buy_course(
    @Body() payload: BuyCourseDto
  ){
    return await this.courseService.buy_course(payload)
  }

  @Get("all/buy")
  buy_course_get() {
    return this.courseService.buy_course_get();
  }

  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  // @ApiOperation({
  //   summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  // })
  @Get("all")
  findAllCourses() {
    return this.courseService.findAllCourses();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("one/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.courseService.findOneCourse(id);
  }


  @ApiBearerAuth('access-token')
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
        banner: { format: "binary", type: "string" },
        intro_video: { format: "binary", type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        level: { type: "string", enum: Object.values(CourseLevel) },
        price: { type: "number" },
        categoryId: { type: "integer" },
        mentorId: { type: "integer" },
        assistantId: { type: "integer" },

      }
    }
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: "banner", maxCount: 1 },
    { name: "intro_video", maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === "banner") {
          cb(null, "./src/uploads/images")
        } else if (file.fieldname === "intro_video") {
          cb(null, "./src/uploads/videos")
        }

      },
      filename: (req, file, cb) => {
        const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
        cb(null, filename)
      }
    })
  })
  )
  @Patch(":id")
  updateCourse(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFiles() files: {
      banner?: Express.Multer.File[];
      intro_video?: Express.Multer.File[];
    }
  ) {
    return this.courseService.updateCourse(
      id,
      updateCourseDto,
      files.banner?.[0]?.filename,
      files.intro_video?.[0]?.filename,
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Patch("active/:id")
  coursActive(
    @Param("id", ParseIntPipe) id: number
  ){
    return this.courseService.coursActive(id)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.courseService.deleteCourse(id);
  }
}
