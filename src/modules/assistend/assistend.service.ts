import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssistendDto } from './dto/create-assistend.dto';
import { UpdateAssistendDto } from './dto/update-assistend.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import hashPassword from 'src/common/config/hash';
import { Status, UserRole } from '@prisma/client';
import { message } from 'telegraf/filters';

@Injectable()
export class AssistendService {
  constructor(private readonly prisma: PrismaService) { }

  async create(payload: CreateAssistendDto, file?: string) {
    const assistend = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: payload.phone },
          { email: payload.email }
        ]
      }
    })
    if (assistend) {
      throw new ConflictException("User already exist with this email or phone")
    }
    await this.prisma.user.create({
      data: {
        full_name: payload.full_name,
        phone: payload.phone,
        email: payload.email || null,
        file: file || null,
        password: await hashPassword(payload.password),
        status: Status.ACTIVE,
        role: UserRole.ASISTENT,
      }
    })

    return {
      success: true,
      message: "Assitend successfully created"
    };
  }

  async findAll() {
    const assitend = await this.prisma.user.findMany({
      where: { role: UserRole.ASISTENT },
      select: {
        id: true,
        full_name: true,
        phone: true,
        email: true,
        file: true,
        role: true,
        create_at: true,
        update_at: true,
        status: true,

        courses: {
          select: {
            id:true,
            name: true,
            create_at:true,
            update_at:true
          }
        }
      }
    })
    return {
      success: true,
      data: assitend
    };
  }

  async findOne(id: number) {
    const assistend = await this.prisma.user.findMany({
      where: {
        OR: [
          { id: id },
          { role: UserRole.ASISTENT }
        ]
      }
    })
    if (!assistend) {
      throw new NotFoundException("User not found with this id")
    }

    return {
      success: true,
      data: assistend
    };
  }

  async update(id: number, payload: UpdateAssistendDto, file?: string) {
    const assistend = await this.prisma.user.findUnique({
      where: { id: id }
    })
    if (assistend?.role !== UserRole.ASISTENT) {
      throw new NotFoundException("Assistend not found with this id")
    }
    if (!assistend) {
      throw new NotFoundException("Assistend not found with this id")
    }
    let hashPass: any = undefined
    if (payload.password) {
      hashPass = await hashPassword(payload.password as string)
    }
    await this.prisma.user.update({
      where: { id: id },
      data: {
        full_name: payload.full_name || assistend.full_name,
        phone: payload.phone || assistend.phone,
        email: payload.email || assistend.email,
        password: hashPass || assistend.password,
        file: file || assistend.file
      }
    })
    return {
      success:true,
      message:"Assistend successfully updated"
    };
  }

  async remove(id: number) {
    const assistend = await this.prisma.user.findMany({
      where: {
        OR: [
          { id: id },
          { role: UserRole.ASISTENT }
        ]
      }
    })
    if (!assistend) {
      throw new NotFoundException("User not found with this id")
    }
    await this.prisma.user.delete({
      where: { id: id }
    })
    return {
      success: true,
      message: "Assistend successfully deleted"
    };
  }
}
