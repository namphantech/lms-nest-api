import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailData } from './interfaces/send-mail-data.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPassword } from 'modules/common/constants';

@Injectable()
export class MyMailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}
  async forgotPassword(mailData: SendMailData<{ hash: string }>) {
    this.mailService.sendMail({
      to: mailData.to,
      subject: ResetPassword.SUBJECT,
      template: './reset-password',
      context: {
        name: mailData.to,
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/reset-password?token=${mailData.data.hash}`,
      },
    });
  }
}
