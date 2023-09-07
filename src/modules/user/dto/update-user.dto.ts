import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../../common/constants';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  readonly firstName: string;

  @ApiProperty()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  readonly roleId: number;

  @ApiProperty()
  @IsOptional()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  readonly password: string;

  @ApiProperty({
    description: 'User status: ACTIVE | INACTIVE',
  })
  @IsOptional()
  @IsEnum(UserStatus, { each: true })
  status?: UserStatus;
}
