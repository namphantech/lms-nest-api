import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Type } from 'class-transformer';

export class UpdatePassword {
  @ApiProperty()
  @Type(() => Number)
  id: number;

  @ApiProperty()
  newPassword: string;
}
