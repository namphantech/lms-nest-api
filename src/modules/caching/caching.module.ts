import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CachingController } from './caching.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './../user';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  controllers: [CachingController],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
