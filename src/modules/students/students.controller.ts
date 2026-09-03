import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import { extname, join } from 'path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorator/role';
import { convertHeic } from 'src/common/utils/image.util';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }



  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        full_name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        file: { format: "binary", type: "string" },
      }
    }
  })
  @Post()
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads/images",
      filename: (req, file, cb) => {
        const filename = new Date().getTime() + extname(file.originalname).toLowerCase();
        cb(null, filename)
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedImage = ['jpg', 'jpeg', 'png', 'svg','svg+xlm'];
      
      if (!allowedImage.includes(file.mimetype.split('/')[1])) {
        return cb(new UnsupportedMediaTypeException(), false);
      }

      cb(null, true);
    },

  }))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() file?: Express.Multer.File) {
    try {
      const filename = file ? await convertHeic(file) : undefined
      return this.studentsService.create(createStudentDto,filename)

    } catch (error) {
      if (file) {
        await unlink(join(process.cwd(), file.path)).catch(() => { })
      }
      throw error

    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Patch('active/:id')
  update(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.update(id);
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
        full_name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        file: { format: "binary", type: "string" },
      }
    }
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads/images",
      filename: (req, file, cb) => {
        const filename = new Date().getTime() + extname(file.originalname).toLowerCase();
        cb(null, filename)
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedImage = ['jpg', 'jpeg', 'png', 'svg','svg+xml','heic']
      
      if (!allowedImage.includes(file.mimetype.split("/")[1])) {
        return cb(new UnsupportedMediaTypeException(), false)
      }
      cb(null, true);
    }
  }))
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      const filename = file ? await convertHeic(file) : undefined
      return this.studentsService.updateStudent(id, updateStudentDto, filename);
    } catch (error) {
      if (file) {
        await unlink(join(process.cwd(), file.path)).catch(() => { })
      }
      throw error
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
