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


@ApiBearerAuth('access-token')
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) { }



  @Get("all")
  getAllMentor() {
    return this.mentorService.getAllMentor();
  }

  @Get('one/:id')
  getOneMentor(@Param('id') id: string) {
    return this.mentorService.getOneMentor(+id);
  }



  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  // @ApiOperation({ summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}` })

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

  createMentor(
    @Body() payload: CreateMentorDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.mentorService.createMentor(payload, file?.filename);
  }





  @Patch(':id')
  updateMentor(
    @Body() payload: UpdateMentorDto,
    @Param("id", ParseIntPipe) id: number) {
    return this.mentorService.updateMentor(payload, id);
  }

  @Delete(":id")
   deleteMentor(@Param("id", ParseIntPipe) id: number) {
    return this.mentorService.deleteMentor(+id);
  }
}
