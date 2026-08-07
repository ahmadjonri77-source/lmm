import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsString, MinLength } from "class-validator"

export class CreateSectionDto {

    @ApiProperty()
    @IsString()
    @MinLength(3)
    name!: string

    @ApiProperty()
    @Type(()=> Number)
    @IsInt()
    courseId!: number
}
