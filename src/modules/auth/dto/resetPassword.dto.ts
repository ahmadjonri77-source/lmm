import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({example:"+998993736777"})
    @IsString()
    phone!: string;

    @ApiProperty({example:"123456"})
    @IsString()
    @Length(6, 6)
    otp!: string;

    @ApiProperty()
    @IsString() 
    password!:string
}