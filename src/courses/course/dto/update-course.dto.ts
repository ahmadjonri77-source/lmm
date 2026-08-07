import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { $Enums, CourseLevel } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {

}
