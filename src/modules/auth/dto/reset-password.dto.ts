import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from './../../common/decorators';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  newPassword: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(5)
  @Match('newPassword')
  passwordConfirm: string;
}
