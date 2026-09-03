import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorator/role';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }



  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Post()
  createSection(@Body() payload: CreateSectionDto) {
    return this.sectionService.createSection(payload);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("all")
  findAllSections() {
    return this.sectionService.findAllSections();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("one/:id")
  findOneSection(@Param("id", ParseIntPipe) id: number) {
    return this.sectionService.findOneSection(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateSectionDto) {
    return this.sectionService.updateSection(id, payload);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(':id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.deleteSection(id);
  }
}
