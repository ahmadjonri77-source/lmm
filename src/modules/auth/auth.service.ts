import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import * as argon from "argon2"
import { JwtToken } from "src/common/config/jwt";
import { randomInt } from "crypto";
import hashPassword from "src/common/config/hash";
import { Status } from "@prisma/client";
import { RedisService } from "../redis/redis.service";
// import { message } from "telegraf/filters";


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtToken: JwtToken,
        private readonly redisService: RedisService,
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
        if (existUser.status !== Status.ACTIVE) {
            throw new NotFoundException("User not ACTIVE")
        }
        return {
            success: true,
            role: existUser.role,
            accessToken: this.jwtToken.jwtAccessToken({ id: existUser.id, full_name: existUser.full_name, role: existUser.role })
        }
    }

    async createTelegramOtp(phone: string) {

        const user = await this.prisma.user.findUnique({
            where: { phone: "+" + phone }
        })

        const otp = randomInt(100000, 1000000)
        if (!user) {
            await this.redisService.setRegOtp(
                "+"+phone,
                String(otp),
            );

            return otp;
        }
        await this.redisService.setResOtp(
            "+"+phone,
            String(otp),
        );

    
        return otp
    }

    async verifyOtp(phone: string, otp: string) {
    const normalizedPhone = "+" + phone.replace("+", "");

    const savedOtp = await this.redisService.getRegOtp(normalizedPhone);

    console.log("PHONE:", normalizedPhone);
    console.log("SAVED OTP:", savedOtp);
    console.log("ENTERED OTP:", otp);

    if (!savedOtp || savedOtp !== otp) {
        throw new NotFoundException(
            "OTP noto'g'ri yoki muddati tugagan"
        );
    }

    await this.redisService.delRegOtp(normalizedPhone);

    return {
        success: true,
        message: "OTP verified",
    };
}


    async resetPassword(phone: string, otp: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { phone: phone }
        })

        if (!user) {
            throw new NotFoundException("User not found with this phone number")
        }
        const savedOtp = await this.redisService.getResOtp(phone)
        if (!savedOtp) {
            throw new NotFoundException(
                "OTP noto'g'ri yoki muddati tugagan"
            );
        }

        if (savedOtp !== otp) {
            throw new NotFoundException(
                "OTP noto'g'ri yoki muddati tugagan"
            );
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: await hashPassword(password)
            }
        })
        await this.redisService.delResOtp(phone);


        return {
            success: true,
            message: "Password successfully changed"
        }
    }


}

