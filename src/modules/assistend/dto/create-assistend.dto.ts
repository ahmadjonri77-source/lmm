import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsMobilePhone, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateAssistendDto {

    @ApiProperty()
    @IsString()
    @MaxLength(30)
    @MinLength(3)
    full_name!: string

    @ApiProperty()
    @IsString()
    @IsMobilePhone()
    phone!: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    email!: string

    @ApiProperty()
    @IsString()
    @MinLength(3)
    password!: string

}
