import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { extname, join } from 'path';
import * as fs from 'fs';
import convert from 'heic-convert';
import { convertHeic } from 'src/common/utils/image.util';





@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) { }


  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })

  @Get("all")
  getAllMentor() {
    return this.mentorService.getAllMentor();
  }

  @Get("all/landing")
  getAllMentorLanding() {
    return this.mentorService.getAllMentorLanding();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })

  @Get('one/:id')
  getOneMentor(@Param('id') id: string) {
    return this.mentorService.getOneMentor(+id);
  }


  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })

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
        experience: { type: "number", nullable: true },
        job: { type: "string", nullable: true },
        web_link: { type: "string", nullable: true },
        description: { type: "string", nullable: true },
        facebook: { type: "string", nullable: true },
        telegram: { type: "string", nullable: true },
        linkedin: { type: "string", nullable: true },
        instagram: { type: "string", nullable: true },
        github: { type: "string", nullable: true },

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
    })
  }))

 async  createMentor(
    @Body() payload: CreateMentorDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const filename = file ? await convertHeic(file) : undefined
    return this.mentorService.createMentor(payload, filename);
  }




  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
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
        experience: { type: "number", nullable: true },
        job: { type: "string", nullable: true },
        web_link: { type: "string", nullable: true },
        description: { type: "string", nullable: true },
        facebook: { type: "string", nullable: true },
        telegram: { type: "string", nullable: true },
        linkedin: { type: "string", nullable: true },
        instagram: { type: "string", nullable: true },
        github: { type: "string", nullable: true },
      }

    }
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads/images",
      filename: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase()

        const filename = new Date().getTime() + ext
        cb(null, filename)
      }
    })
  }))
  async updateMentor(
    @Body() payload: UpdateMentorDto,
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File
  ) {

    const filename = file ? await convertHeic(file) : undefined

    return this.mentorService.updateMentor(payload, id, filename);
  }


  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })

  @Delete(":id")
  deleteMentor(@Param("id", ParseIntPipe) id: number) {
    return this.mentorService.deleteMentor(+id);
  }
}
