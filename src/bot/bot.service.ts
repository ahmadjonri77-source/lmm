import { Injectable } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class BotService {
    constructor(private readonly authService: AuthService) { }
    async createOtp(phone: string) {
        return this.authService.createTelegramOtp(phone)
    }
}