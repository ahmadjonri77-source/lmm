import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) { }

  async createLesson(payload: CreateLessonDto, file: string) {
    console.log(file);

    await this.prisma.lessons.create({
      data: {
        name: payload.name,
        sectionId: payload.sectionId,
        description: payload.description,
        file: file
      }
    })
    return {
      success: true,
      message: "Lesson successfully created"
    }
  }

  async findAllLessons() {
    const Lesson = await this.prisma.lessons.findMany()

    return {
      success: true,
      data: Lesson
    };
  }

  async findOneLesson(id: number) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: id }
    })
    if (!lesson) {
      throw new NotFoundException("Lesson not found with this id")
    }

    return {
      success: true,
      data: lesson
    };
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  async deleteLesson(id: number) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: id }
    })
    if (!lesson) {
      throw new NotFoundException("Lesson not found with this id")
    }

    await this.prisma.lessons.delete({
      where:{id:id}
    })

    return {
      success:true,
      message:"Lesson successfully deleted"
    };
  }
}
