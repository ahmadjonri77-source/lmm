import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsMobilePhone, IsOptional, IsString, MaxLength, MinLength} from "class-validator"

export class CreateAdminDto{
    @ApiProperty()
    @IsString()
    @MaxLength(30)
    @MinLength(3)
    full_name!:string

    @ApiProperty()
    @IsMobilePhone()
    phone!:string

    @Transform(({ value }) => value === '' ? undefined : value)
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email!:string

    @ApiProperty()
    @IsString()
    @MinLength(3)
    password!:string
}