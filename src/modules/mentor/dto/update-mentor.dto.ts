import { PartialType } from '@nestjs/swagger';
import { CreateMentorDto } from './create-mentor.dto';
import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateMentorDto extends PartialType(CreateMentorDto) {
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    @MinLength(3)
    full_name?: string

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    @IsPhoneNumber()
    phone?: string

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    email?: string | undefined;

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @IsString()
    @MinLength(3)
    password?: string
}
