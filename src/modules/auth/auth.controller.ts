import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("login")
    login(@Body() payload: LoginDto) {
        return this.authService.login(payload)
    }
    @Post("verify-otp")
    verifyOtp(@Body() payload:VerifyOtpDto){
        return this.authService.verifyOtp(payload.phone,payload.otp)
        
    }
    @Post("resetPassword")
    resetPassword(@Body() payload:ResetPasswordDto){
        return this.authService.resetPassword(payload.phone,payload.otp,payload.password)
    }
}