import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) { }

  async createLesson(payload: CreateLessonDto, file: string) {
    const lessonname = await this.prisma.lessons.findUnique({
      where: { name: payload.name }
    })
    if (lessonname) {
      throw new ConflictException("Lesson already exist with this name")
    }
    const section = await this.prisma.sections.findUnique({
      where: { id: payload.sectionId }
    })
    if (!section) {
      throw new NotFoundException("Section not found with this id")
    }

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

  async update(id: number, payload: UpdateLessonDto, file: string) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: id }
    })
    if (!lesson) {
      throw new NotFoundException("Lesson not found with this id")
    }

    const lessonname = await this.prisma.lessons.findUnique({
      where: { name: payload.name }
    })
    if (lessonname) {
      throw new ConflictException("Lesson already exist with this name")
    }
    const section = await this.prisma.sections.findUnique({
      where: { id: payload.sectionId }
    })
    if (!section) {
      throw new NotFoundException("Section not found with this id")
    }


    console.log(payload, file);

    await this.prisma.lessons.update({
      where: { id: id },
      data: {
        ...payload,
        sectionId: payload.sectionId || lesson?.sectionId,
        file: file || lesson?.file

      }
    })

    return {
      success: true,
      message: "Lesson updated successfully"
    };
  }

  async deleteLesson(id: number) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: id }
    })
    if (!lesson) {
      throw new NotFoundException("Lesson not found with this id")
    }

    await this.prisma.lessons.delete({
      where: { id: id }
    })
    await unlink(join(process.cwd(), "src/uploads/videos", lesson.file)).catch(() => { })

    return {
      success: true,
      message: "Lesson successfully deleted"
    };
  }
}
