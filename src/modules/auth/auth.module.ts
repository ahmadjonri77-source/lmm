import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtToken } from "src/common/config/jwt";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/core/database/prisma.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports:[
        JwtModule.register({
            secret:process.env.SECRET_KEY,
            signOptions:{
                expiresIn:'1h'
            }
        }),
        PrismaModule,
        RedisModule
    ],
    controllers:[AuthController],
    providers:[AuthService,JwtToken],
    exports:[JwtModule,JwtToken,AuthService]
})
export class AuthModule{}