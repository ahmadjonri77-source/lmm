import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
   async canActivate(context: ExecutionContext):  Promise<boolean>  {
       try {
         let req = context.switchToHttp().getRequest()
        let token = req.headers.authorization
        if (!token) {
            throw new UnauthorizedException()
        }
        token = token.split(" ")[1]
        const user = await this.jwtService.verify(token, { secret: process.env.SECRET_KEY })
        req.user  = user

        return true
       } catch (error) {
        throw new BadRequestException(error)
       }

    }
}