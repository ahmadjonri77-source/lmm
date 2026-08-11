import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateHomeworkDto {

    @ApiProperty()
    @Type(()=> Number)
    @IsInt()
    lessonId!: number

    @ApiProperty()
    @IsString()
    description!:string
}
