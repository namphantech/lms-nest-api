import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SameAs } from '../../common/validator';

export class RegisterPayload {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(8)
  password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;
}
