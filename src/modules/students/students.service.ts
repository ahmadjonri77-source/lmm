import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';
import { message } from 'telegraf/filters';
import hashPassword from 'src/common/config/hash';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(payload: CreateStudentDto, file?: string) {
    const existAdmin = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: payload.phone },
          { email: payload.email }
        ]
      }
    })
    if (existAdmin) {
      throw new ConflictException("User already exist with this email or phone")
    }

    const user = await this.prisma.user.create({
      data: {
        file: file || null,
        full_name: payload.full_name,
        email: payload.email || null,
        phone: payload.phone,
        password: await hashPassword(payload.password),
        status: Status.INACTIVE,
        role: UserRole.STUDENT
      }
    })
    return {
      success: true,
      message: "Student successfully created",
      data: { id: user.id }
    };
  }

  async findAll() {
    const students = await this.prisma.user.findMany({
      where: { role: UserRole.STUDENT }
    })

    return {
      success: true,
      data: students
    };
  }

  async findOne(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id: id }
    })
    if (student?.role !== UserRole.STUDENT) {
      throw new NotFoundException("Student not found with this id")
    }
    if (!student) {
      throw new NotFoundException("Student not found with this id")
    }
    return {
      success: true,
      data: student
    };
  }

  async update(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id: id }
    })
    if (student?.role !== UserRole.STUDENT) {
      throw new NotFoundException("Student not found with this id")
    }
    if (!student) {
      throw new NotFoundException("Student not found with this id")
    }
    await this.prisma.user.update({
      where: { id: id },
      data: {
        status: Status.ACTIVE
      }
    })
    return {
      success: true,
      message: "Student updated successfully"
    };
  }

  async updateStudent(id: number, payload: UpdateStudentDto, file?: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: id }
    })
    if (student?.role !== UserRole.STUDENT) {
      throw new NotFoundException("Student not found with this id")
    }
    if (!student) {
      throw new NotFoundException("Student not found with this id")
    }
    let hashPass: any = undefined
    if (payload.password) {
      hashPass = await hashPassword(payload.password as string)
    }

    await this.prisma.user.update({
      where: { id: id },
      data: {
        full_name: payload.full_name || student.full_name,
        phone: payload.phone || student.phone,
        email: payload.email || student.email,
        password: hashPass || student.password,
        file: file || student.file
      }
    })
    return {
      success: true,
      message: "Student updated successfully"
    };
  }


  async remove(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id: id }
    })
    console.log(student?.role);

    if (!student || student?.role !== "STUDENT") {
      throw new NotFoundException("User not found with this id")
    }
    await this.prisma.user.delete({
      where: { id: id }
    })
    return {
      success: true,
      message: "Student successfully deleted"
    };
  }
}
