import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }

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

  async findAllCourses() {
    const allCourses = await this.prisma.courses.findMany()

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
    const Course = await this.prisma.courses.findUnique({
      where: { id: id }
    })

    return {
      success: true,
      data: Course
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
   

   if(payload.mentorId !== 0){
     const mentor = await this.prisma.mentorProfile.findUnique({
      where: {
        userId: payload.mentorId,
      },
    });
    if (!mentor) {
      throw new NotFoundException("Mentor profile not found");
    }
   }
    const existname = await this.prisma.courses.findUnique({
      where: { name: payload.name }
    })

    if (existname) {
      throw new ConflictException("This course name already exist")
    }
    
    await this.prisma.courses.update({
      where: { id: id },


      data: {
        mentorId: payload.mentorId || course?.mentorId,
        assistantId: payload.assistantId || course?.assistantId,
        banner: banner ?? course?.banner,
        intro_video: intro_video ?? course?.intro_video,
        name: payload.name || course?.name,
        description: payload.description ?? course?.description,
        categoryId: payload.categoryId || course?.categoryId,
        price: payload.price || course?.price,
        level: payload.level || course?.level,
      }
    })
    return{
      success:true,
      message:"Course successfull updated"
    }
    
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
    if(existCourse.banner){
      await unlink( join(process.cwd(), "src/uploads/images",existCourse.banner)).catch(()=>{})
    }
    if(existCourse.intro_video){
      await unlink(join(process.cwd(),"src/uploads/videos", existCourse.intro_video)).catch(()=>{})
    }




    return {
      success: true,
      message: "Course successfully deleted"
    };
  }
}
