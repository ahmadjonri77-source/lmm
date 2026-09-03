import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
       private readonly redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379
    });
    async setRegOtp(phone: string, otp: string) {


        await this.redis.set(
            `registration:otp:${phone}`,
            otp,
            `EX`,
            300
        )

    }
    async getRegOtp(phone: string) {
        console.log(phone);
        return await this.redis.get(
            `registration:otp:${phone}`,
        )
    }
    async delRegOtp(phone: string) {
        return await this.redis.del(
            `registration:otp:${phone}`,
        )
    }
    async setResOtp(phone: string, otp: string) {
        await this.redis.set(
            `password-reset:otp:${phone}`,
            otp,
            `EX`,
            300
        )
    }
    async getResOtp(phone: string) {
        return await this.redis.get(
            `password-reset:otp:${phone}`,
        );
    }
    async delResOtp(phone: string) {
        return await this.redis.del(
            `password-reset:otp:${phone}`,
        );
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
}