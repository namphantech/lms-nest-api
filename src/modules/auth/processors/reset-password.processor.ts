import { Process, Processor } from '@nestjs/bull';
import { MyMailService } from './../../mail/mail.service';
import { Job } from 'bull';
import { SendMailData } from './../../mail/interfaces/send-mail-data.interface';

@Processor('send-mail-queue')
export class ResetPasswordProcessor {
  constructor(private readonly mailService: MyMailService) {}
  @Process('reset-password')
  async sendResetPasswordEmail(job: Job<SendMailData<{ hash: string }>>) {
    const { data } = job;

    await this.mailService.forgotPassword(data);
    console.log(`Job completed with ${job.id}`);
    return {
      jobQueueId: job.id,
    };
  }
}
