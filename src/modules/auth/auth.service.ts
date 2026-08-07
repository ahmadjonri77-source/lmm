import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import * as argon from "argon2"
import { JwtToken } from "src/common/config/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtToken:JwtToken

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
    return{
        success:true,
        accessToken:  this.jwtToken.jwtAccessToken({id:existUser.id,full_name:existUser.full_name, role:existUser.role }),
        refreshToken:  this.jwtToken.jwtRefreshToken({id:existUser.id,full_name:existUser.full_name, role:existUser.role })
    }
    }


    

}

