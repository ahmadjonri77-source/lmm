import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString } from "class-validator";

export class LoginDto{
    
    @ApiProperty({example:"+998993736777"})
    @IsMobilePhone()
    phone!:string

    @ApiProperty({example:"Ahmadjon77"})
    @IsString()
    password!:string
}