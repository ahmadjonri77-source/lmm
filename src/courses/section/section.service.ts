import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class SectionService {

  constructor(private prisma: PrismaService) { }
  async createSection(payload: CreateSectionDto) {
    const existSection = await this.prisma.sections.findUnique({
      where: { name: payload.name }
    })
    if (existSection) {
      throw new ConflictException("This Section name already exist")
    }
    const existCouse = await this.prisma.courses.findUnique({
      where: { id: payload.courseId }
    })
    if (!existCouse) {
      throw new NotFoundException("Course not found with this id")
    }
    await this.prisma.sections.create({
      data: { ...payload }
    })
    return {
      success: true,
      message: "Section created successfully"
    };
  }

  async findAllSections() {
    const AllSections = await this.prisma.sections.findMany()

    return {
      success: true,
      data: AllSections
    };
  }

  async findOneSection(id: number) {

    const Section = await this.prisma.sections.findUnique({
      where: { id: id }
    })
    if (!Section) {
      throw new NotFoundException("Section not found with this id")
    }

    return {
      success: true,
      data: Section,
    };
  }

  async updateSection(id: number, payload: UpdateSectionDto) {
    const Section = await this.prisma.sections.findUnique({
      where:{id:id}
    })


   if(payload.courseId){
     const existCouse = await this.prisma.courses.findUnique({
      where: { id: payload.courseId }
    })
    if (!existCouse) {
      throw new NotFoundException("Course not found with this id")
    }
   }
    
    await this.prisma.sections.update({
      where: { id: id },
      data:{
        name:payload.name || Section?.name,
        courseId:payload.courseId || Section?.courseId
      }
    })

    return {
      success:true,
      message:"Section updated successfully"
    };
  }

  async deleteSection(id: number) {
    const existSection = await this.prisma.sections.findUnique({
      where: { id: id }
    })

    if (!existSection) {
      throw new NotFoundException("Section not found with this id")
    }
    await this.prisma.sections.delete({
      where: { id: id }
    })
    return {
      success: true,
      message: "Section deleted successfully"
    };
  }
}
