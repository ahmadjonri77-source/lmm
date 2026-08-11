import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UserRole } from "@prisma/client";
import hashPassword from "src/common/config/hash";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getAllAdmin() {
        const allAdmin = await this.prisma.user.findMany({
            where: { role: UserRole.ADMIN }
        })
        return {
            success: true,
            data: allAdmin
        }
    }


    async createAdmin(payload: CreateAdminDto, filename?: string) {

        const existAdmin = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })
        if (existAdmin) {
            throw new ConflictException("Admin already exist with this email or phone")
        }
        await this.prisma.user.create({
            data: {
                ...payload,
                role: UserRole.ADMIN,
                password: await hashPassword(payload.password),
                file: filename || null
            }
        })
        return {
            success: true,
            message: "Admin created"
        }

    }
    async updateAdmin(payload: UpdateAdminDto, id: number) {
        const existAdmin = await this.prisma.user.findFirst({
            where: {
                id: id,
                role: UserRole.ADMIN
            }

        })
        if (!existAdmin) {
            throw new NotFoundException("Admin not found with this id")
        }
        await this.prisma.user.update({
            where: { id: id },
            data: {
                ...payload

            }
        })

        return {
            success: true,
            message: "Admin updated succesfully!"
        }
    }

    async deleteAdmin(id: number) {
        const existAdmin = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existAdmin) {
            throw new NotFoundException("Admin not found");
        }
        await this.prisma.user.delete({
            where: { id: id }
        })
        return {
            success: true,
            message: "Admin deleted succesfully!"
        }

    }
} 