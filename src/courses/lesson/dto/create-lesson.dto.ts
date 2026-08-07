import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsString } from "class-validator"

export class CreateLessonDto {

    @ApiProperty()
    @IsString()
    name!: string

    @ApiProperty()
    @Type(()=> Number)
    @IsInt()
    sectionId!: number

    @ApiProperty()
    @IsString()
    description!: string

}
