import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { NotificationEntity } from 'src/notifications/entities/notification.entitiee';
import { NotificationService } from 'src/notifications/notification.service';
import { TwilioService } from 'src/notifications/twilio.service';
import { NotificationEntity } from 'src/notifications/entities/notification.entitie';

@Processor('notifications')
export class SmsProcessor extends WorkerHost {
  constructor(
    @InjectRepository(NotificationEntity)
    private repo: Repository<NotificationEntity>,
    private service: NotificationService,
    private readonly twilioService: TwilioService,
  ) {
    super();
  }

  async process(job: Job) {
    const { id, channel } = job.data;
    if (channel !== 'sms') return;

    const notification = await this.repo.findOneBy({ id });
    if (!notification) return;

    try {
      const payload = notification.payload as { text: string };
      await this.twilioService.sendSms(notification.recipient, payload.text);
      await this.service.markAsSent(id);
    } catch (err: any) {
      await this.service.markAsFailed(id, err.message);
      throw err;
    }
  }
}
