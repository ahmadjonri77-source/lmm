import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';
import hashPassword from 'src/common/config/hash';

@Injectable()
export class MentorService {
  constructor(private prisma: PrismaService) { }


  async createMentor(payload: CreateMentorDto, filename?: string) {
    const existMentor = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: payload.phone },
          { email: payload.email }
        ]
      }
    })
    if (existMentor) {
      throw new ConflictException("Admin already exist with this email or phone")
    }
    await this.prisma.user.create({
      data: {
        full_name: payload.full_name,
        phone: payload.phone,
        role: UserRole.TEACHER,
        email: payload.email,
        password: await hashPassword(payload.password),
        file: filename || null,
        mentorProfiles: {
          create: {
            experience: payload.experience,
            job: payload.job,
            web_link: payload.web_link,
            description: payload.description,
            facebook: payload.facebook,
            telegram: payload.telegram,
            linkedin: payload.linkedin,
            instagram: payload.instagram,
            github: payload.github,

          }
        }

      },
      include: {
        mentorProfiles: true,
      },
    })
    return {
      success: true,
      message: "Mentor created succesfully"
    }

  }

  async getAllMentor() {
    const allMentor = await this.prisma.user.findMany({
      where: {
        role: UserRole.TEACHER
      },
      include: {
        mentorProfiles: true,
      },
    });
    return {
      success: true,
      data: allMentor
    }
  }

  async getOneMentor(id: number) {


    const mentor = await this.prisma.user.findFirst({

      where: {
        id: id,
        role: UserRole.TEACHER

      },
      include: {
        mentorProfiles: true,
      },
    })
    if (!mentor) {
      throw new NotFoundException("Mentor not found with this id")
    }
    return {
      success: true,
      data: mentor
    };
  }

  async updateMentor(payload: UpdateMentorDto, id: number) {

    const existmentor = await this.prisma.user.findFirst({
      where: {
        id: id,
        role: UserRole.TEACHER
      }
    })
    if (!existmentor) {
      throw new NotFoundException("Mentor not found with this id")
    }
    await this.prisma.user.update({
      where: { id: id },
      data: {
        full_name: payload.full_name,
        phone: payload.phone,
        email: payload.email,

        mentorProfiles: {
          update: {
            experience: payload.experience,
            job: payload.job,
            web_link: payload.web_link,
            description: payload.description,
            facebook: payload.facebook,
            telegram: payload.telegram,
            linkedin: payload.linkedin,
            instagram: payload.instagram,
            github: payload.github,
          },
        },
      },
      include: {
        mentorProfiles: true,
      },
    })

    return {
      success: true,
      message: "Mentor updated seccessfully"
    }


  }

  async deleteMentor(id: number) {
    const existmentor = await this.prisma.user.findFirst({
      where: {
        id: id,
        role: UserRole.TEACHER
      }
    })
    if (!existmentor) {
      throw new NotFoundException("Mentor not found with this id")
    }

    await this.prisma.mentorProfile.delete({
      where: {
        userId: id
      }
    }),
      await this.prisma.user.delete({
        where: { id: id }
      })
    return {
      success: true,
      message: "Mentor deleted successfully"
    };
  }
}
