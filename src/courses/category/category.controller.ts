import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorator/role';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiBearerAuth('access-token')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Post()
  createCategory(
    @Body() payload: CreateCategoryDto
  ) {
    return this.categoryService.createCategory(payload);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("all")
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Get("one/:id")
  getOneCategory(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.getOneCategory(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Patch(":id")
  updateCategory(@Param("id", ParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto) {
    return this.categoryService.updateCategory(+id, payload);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
  })
  @Delete(':id')
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
