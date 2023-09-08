import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigService } from './mail-config.service';
import { MyMailService } from './mail.service';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
  ],
  providers: [MyMailService],
  exports: [MyMailService],
})
export class MailModule {}
