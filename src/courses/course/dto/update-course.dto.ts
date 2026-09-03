import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import {  IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    description?: string | undefined;

}   
