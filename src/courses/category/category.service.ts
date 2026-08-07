import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }

  async createCategory(payload: CreateCategoryDto) {
    const existCategory = await this.prisma.categories.findUnique({
      where: { name: payload.name }
    })
    if (existCategory) {
      throw new ConflictException("Category already exist with this name")
    }

    await this.prisma.categories.create({
      data: {
        ...payload
      }
    })
    return {
      success: true,
      message: "Category created"
    };
  }

  async getAllCategories() {
    const Categories = await this.prisma.categories.findMany()
    return {
      success: true,
      data: Categories
    };
  }

  async getOneCategory(id: number) {

    const Category = await this.prisma.categories.findUnique({
      where: { id: id }
    })

    if (!Category) {
      throw new NotFoundException("Category not found with this id")
    }
    return {
      success: true,
      data: Category
    };
  }

  async updateCategory(id: number, payload: UpdateCategoryDto) {
    const Category = await this.prisma.categories.findUnique({
      where: { id: id }
    })

    if (!Category) {
      throw new NotFoundException("Category not found with this id")
    }
    await this.prisma.categories.update({
      where: { id: id },
      data:payload
    })
    return {
      success: true,
      message: "Category updated successfully"
    };
  }

  async deleteCategory(id: number) {
    const Category = await this.prisma.categories.findUnique({
      where: { id: id }
    })

    if (!Category) {
      throw new NotFoundException("Category not found with this id")
    }
    await this.prisma.categories.delete({
      where:{id:id}
    })

    return {
      success: true,
      message: "Category deleted successfully"
    };
  }
}
