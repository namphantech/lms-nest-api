
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
@Injectable()
export class MailConfigService implements MailerOptionsFactory {
  private readonly _ses: any;
  constructor(private configService: ConfigService) {}
  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get('mail.host'),
        secure: false,
        auth: {
          user: this.configService.get('mail.user'),
          pass: this.configService.get('mail.password'),
        },
      },
      defaults: {
        from: `"${this.configService.get(
          'mail.defaultName'
        )}" <${this.configService.get('awsSES.emailSender')}>`,
      },
      template: {
        dir: path.join(
          this.configService.get('app.workingDirectory'),
          'src',
          'modules',
          'mail',
          'mail-templates'
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    } as MailerOptions;
  }
}
