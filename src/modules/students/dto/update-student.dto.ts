import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    @MinLength(3)
    full_name?: string;

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    @MinLength(3)
    password?: string;

}
