import { ApiProperty } from "@nestjs/swagger"
import { IsMobilePhone, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    @MaxLength(30)
    @MinLength(3)
    full_name!: string

    @ApiProperty()
    @IsMobilePhone()
    phone!: string

    @ApiProperty()
    @IsOptional()
    email?: string

    @ApiProperty()
    @IsString()
    @MinLength(3)
    password!: string
}
