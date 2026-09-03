import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AssistendService } from './assistend.service';
import { CreateAssistendDto } from './dto/create-assistend.dto';
import { UpdateAssistendDto } from './dto/update-assistend.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import { join } from 'node:path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorator/role';

@ApiBearerAuth('access-token')
@Controller('assistend')
export class AssistendController {
  constructor(private readonly assistendService: AssistendService) { }


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
      },
      required: ["full_name", "phone", "password"]
    }
  })
  @Post()
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads/images",
      filename: (req, file, cb) => {
        const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
        cb(null, filename)
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedImage = ['jpg', 'jpeg', 'png', 'svg'];

      if (!allowedImage.includes(file.mimetype.split('/')[1])) {
        return cb(new UnsupportedMediaTypeException(), false);
      }

      cb(null, true);
    },

  }))
  async create(
    @Body() createAssistendDto: CreateAssistendDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      return this.assistendService.create(createAssistendDto, file?.filename)
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
  @Get("all")
  findAll() {
    return this.assistendService.findAll();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get('one/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assistendService.findOne(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @ApiConsumes("multpart/form-data")
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
        const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
        cb(null, filename)
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedImage = ['jpg', 'jpeg', 'png', 'svg']
      if (!allowedImage.includes(file.mimetype.split("/")[1])) {
        return cb(new UnsupportedMediaTypeException(), false)
      }
      cb(null, true);
    }
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssistendDto: UpdateAssistendDto,
    @UploadedFile() file?: Express.Multer.File) {
    try {
      return this.assistendService.update(id, updateAssistendDto, file?.filename);
    } catch (error) {
      if (file) { await unlink(join(process.cwd(), file?.path)).catch(() => { }) }
      throw error
    }

  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistendService.remove(+id);
  }
}
