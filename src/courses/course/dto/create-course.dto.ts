import { ApiProperty } from "@nestjs/swagger"
import { CourseLevel } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class CreateCourseDto {


    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    mentorId!: number


    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    assistantId?: number


    @ApiProperty()
    @IsString()
    name!: string


    @ApiProperty(
        {
            type: "string",
            format: "binary",
        }
    )
    banner!: any


    @ApiProperty(
        {
            type: "string",
            format: "binary",
        }
    )
    intro_video!: any


    @ApiProperty()
    @IsString()
    description!: string


    @ApiProperty({
        example: 500000,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    categoryId!: number;

    @ApiProperty({
        enum: CourseLevel,
        enumName: "CourseLevel",
    })
    @IsEnum(CourseLevel)
    level!: CourseLevel
}
