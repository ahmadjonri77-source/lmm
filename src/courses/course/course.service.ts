import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BuyCourseDto, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService,) { }

  async createCourse(payload: CreateCourseDto, banner, intro_video) {

    if (payload.assistantId) {
      const assistant = await this.prisma.user.findFirst({
        where: {
          role: UserRole.ASISTENT,
          id: payload.assistantId,

        },
      });

      if (!assistant) {
        throw new NotFoundException("Assistand not found with this id");
      }
    }



    const mentor = await this.prisma.mentorProfile.findUnique({
      where: {
        userId: payload.mentorId,
      },
    });

    const existname = await this.prisma.courses.findUnique({
      where: { name: payload.name }
    })


    if (existname) {
      throw new ConflictException("This course name already exist")
    }
    if (!mentor) {
      throw new NotFoundException("Mentor profile not found");
    }

    await this.prisma.courses.create({


      data: {

        mentorId: mentor.id,
        assistantId: payload.assistantId || null,
        banner,
        intro_video,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        categoryId: payload.categoryId,
        level: payload.level
      }
    })
    return {
      success: true,
      message: "Course is created"
    }

  }

  async buy_course(payload: BuyCourseDto) {
    const existuser = await this.prisma.user.findUnique({
      where: { id: payload.userId }
    })
    const existCourse = await this.prisma.courses.findUnique({
      where: { id: payload.coursesId }
    })
    if (!existuser) {
      throw new NotFoundException("User not found with this id");
    }
    if (!existCourse) {
      throw new NotFoundException("Course not found with this id");
    }

    await this.prisma.assignedCourse.create({
      data: payload
    })

    return {
      success: true
    }



  }
  async buy_course_get() {

    const all = await this.prisma.assignedCourse.findMany()

    return {
      success: true,
      data: all
    }

  }

  async findAllCourses() {
    const allCourses = await this.prisma.courses.findMany({
      include: {
        categories: true
      }
    })

    return {
      success: true,
      message: allCourses
    };
  }

  async findOneCourse(id: number) {
    const existCourse = await this.prisma.courses.findUnique({
      where: { id: id }
    })
    if (!existCourse) {
      throw new NotFoundException("Course not found with this id");
    }

    return {
      success: true,
      data: existCourse
    };
  }

  async updateCourse(
    id: number,
    payload: UpdateCourseDto,
    banner,
    intro_video
  ) {

    const course = await this.prisma.courses.findUnique({
      where: { id: id }
    })


    if (payload.mentorId !== 0) {
      const mentor = await this.prisma.mentorProfile.findUnique({
        where: {
          userId: payload.mentorId,
        },
      });
      if (!mentor) {
        throw new NotFoundException("Mentor profile not found");
      }
    }
    if (course?.name !== payload.name) {
      const existname = await this.prisma.courses.findUnique({
        where: { name: payload.name }
      })

      if (existname) {
        throw new ConflictException("This course name already exist")
      }

    }
    // const mentor = await this.prisma.mentorProfile.findUnique({
    //   where: {
    //     userId: payload.mentorId,
    //   },
    // });

    // if (!mentor) {
    //   throw new NotFoundException("Mentor profile not found");
    // }


    await this.prisma.courses.update({
      where: { id: id },


      data: {
        mentorId: payload.mentorId || course?.mentorId,
        assistantId: payload.assistantId || course?.assistantId,
        banner: banner || course?.banner,
        intro_video: intro_video || course?.intro_video,
        name: payload.name || course?.name,
        description: payload.description || course?.description,
        categoryId: payload.categoryId || course?.categoryId,
        price: payload.price || course?.price,
        level: payload.level || course?.level,
      }
    })
    return {
      success: true,
      message: "Course successfull updated"
    }

  }
  async coursActive(id: number) {
    const cours = await this.prisma.assignedCourse.findUnique({
      where: { id: id }
    })

    if (!cours) {
      throw new NotFoundException("AssignedCourse not found with this id")
    }
    await this.prisma.assignedCourse.update({
      where: { id: id },
      data: {
        status: Status.ACTIVE
      }
    })
    return {
      success: true,
      message: "AssignedCourse updated successfully"
    };
  }

  async deleteCourse(id: number) {
    const existCourse = await this.prisma.courses.findUnique({
      where: { id: id }
    })
    if (!existCourse) {
      throw new NotFoundException("Course not found with this id");
    }

    await this.prisma.courses.delete({
      where: { id: id }
    })
    if (existCourse.banner) {
      await unlink(join(process.cwd(), "src/uploads/images", existCourse.banner)).catch(() => { })
    }
    if (existCourse.intro_video) {
      await unlink(join(process.cwd(), "src/uploads/videos", existCourse.intro_video)).catch(() => { })
    }




    return {
      success: true,
      message: "Course successfully deleted"
    };
  }
}
