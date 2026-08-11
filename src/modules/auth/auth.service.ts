import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import * as argon from "argon2"
import { JwtToken } from "src/common/config/jwt";
import { randomInt } from "crypto";
import hashPassword from "src/common/config/hash";
import { message } from "telegraf/filters";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtToken: JwtToken

    ) { }



    async login(payload: LoginDto) {

        const existUser = await this.prisma.user.findFirst({
            where: {
                phone: payload.phone
            }
        })

        if (!existUser) {
            throw new NotFoundException("User not found with this email or phone")
        }

        if (!await argon.verify(existUser.password, payload.password)) {
            throw new NotFoundException("User not found with this email or phone")

        }
        return {
            success: true,
            accessToken: this.jwtToken.jwtAccessToken({ id: existUser.id, full_name: existUser.full_name, role: existUser.role })
        }
    }

    async createTelegramOtp(phone: string) {

        const user = await this.prisma.user.findUnique({
            where: { phone: "+" + phone }
        })

        if (!user) {
            throw new NotFoundException("User not found with this phone number")
        }
        const otp = randomInt(100000, 1000000)
        const expiresAt = new Date(Date.now() + 5 * 60 * 100,)



        await this.prisma.passwordReset.create({
            data: {
                userId: user.id,
                otp: String(otp),
                expiresAt,
            }
        })
        return otp
    }

    async verifyOtp(phone: string, otp: string) {
        const user = await this.prisma.user.findUnique({
            where: { phone: phone }
        })

        if (!user) {
            throw new NotFoundException("User not found with this phone number")
        }

        const reset = await this.prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                otp,
                expiresAt: {
                    gt: new Date(),
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if (!reset) {
            throw new NotFoundException("OTP noto'g'ri yoki muddati tugagan")
        }
        return {
            success: true,
            message: 'OTP verified',
            resetId: reset.id,
        };
    }
    async resetPassword(phone: string, otp: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { phone: phone }
        })

        if (!user) {
            throw new NotFoundException("User not found with this phone number")
        }

        const reset = await this.prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                otp,
                expiresAt: {
                    gt: new Date(),
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if (!reset) {
            throw new NotFoundException("OTP noto'g'ri yoki muddati tugagan")
        }


        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: await hashPassword(password)
            }
        })
        await this.prisma.passwordReset.delete({
            where: {
                id: reset.id,
            },
        });

        return{
            success:true,
            message:"Password successfully changed"
        }
    }


}

