import { ApiProperty } from '@nestjs/swagger';

export class CreateDataOnRedis {
  @ApiProperty()
  key: string;

  @ApiProperty({ example: { name: 'hello' } })
  value: any;

  @ApiProperty()
  ttl: number;
}
