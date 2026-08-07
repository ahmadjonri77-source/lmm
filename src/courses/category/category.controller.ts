import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Post()
  createCategory(
    @Body() payload: CreateCategoryDto 
  ) {
    return this.categoryService.createCategory(payload);
  }

  @Get("all")
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get("one/:id")
  getOneCategory(@Param("id",ParseIntPipe) id: number) {
    return this.categoryService.getOneCategory(id);
  }

  @Patch(":id")
  updateCategory(@Param("id",ParseIntPipe) id: number,
   @Body() payload: UpdateCategoryDto) {
    return this.categoryService.updateCategory(+id, payload);
  }

  @Delete(':id')
  remove(@Param("id",ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
