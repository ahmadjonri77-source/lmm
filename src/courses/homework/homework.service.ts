import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) { }

  async createHomework(payload: CreateHomeworkDto, file?: string) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: payload.lessonId }
    })
    if (!lesson) {
      throw new NotFoundException("Lesson not found with this id")
    }

    await this.prisma.homeworks.create({
      data: {
        file: file || null,
        lessonId: payload.lessonId,
        description: payload.description
      }
    })

    return {
      success: true,
      message: "Homework successfully created"
    };
  }

  async getAllHomeworks() {
    const homework = await this.prisma.homeworks.findMany()
    return {
      success: true,
      data: homework
    };
  }

  async findOne(id: number) {
    const homework = await this.prisma.homeworks.findUnique({
      where: { id: id }
    })
    return {
      success:true,
      data:homework
    };
  }

  async updateHomework(
    id: number,
    payload: UpdateHomeworkDto,
    file?: string) {
    if (payload.lessonId) {
      const lesson = await this.prisma.lessons.findUnique({
        where: { id: payload.lessonId }
      })
      if (!lesson) {
        throw new NotFoundException("Lesson not found with this id")
      }
    }

    const homework = await this.prisma.homeworks.findUnique({
      where: { id: id }
    })
    if (!homework) {
      throw new NotFoundException("Homework not fount with this id")
    }
    await this.prisma.homeworks.update({
      where: { id: id },
      data: {
        description: payload.description || homework.description,
        lessonId: payload.lessonId || homework.lessonId,
        file: file || homework.file,

      }
    })
    return {
      success: true,
      message: "Homework successfully updated"
    };
  }

  async remove(id: number) {

    const homework = await this.prisma.homeworks.findUnique({
      where: { id: id }
    })
    if (!homework) {
      throw new NotFoundException("Homework not fount with this id")
    }
    await this.prisma.homeworks.delete({
      where: { id: id }
    })
    return {
      success: true,
      message: "Homework deleted successfully"
    };
  }
}
