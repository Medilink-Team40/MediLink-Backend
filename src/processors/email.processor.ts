import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from 'src/notifications/entities/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { NodemailerService } from 'src/notifications/nodemailer.service';

@Processor('notifications')
export class EmailProcessor extends WorkerHost {
  constructor(
    @InjectRepository(NotificationEntity)
    private repo: Repository<NotificationEntity>,
    private service: NotificationService,
    private readonly nodemailerService: NodemailerService,
  ) {
    super();
  }

  async process(job: Job) {
    const { id, channel } = job.data;
    if (channel !== 'email') return;

    const notification = await this.repo.findOneBy({ id });
    if (!notification) return;

    try {
      const payload = notification.payload as { subject: string; html: string };
      await this.nodemailerService.sendMail(
        notification.recipient,
        payload.subject,
        payload.html,
      );
      await this.service.markAsSent(id);
    } catch (err: any) {
      await this.service.markAsFailed(id, err.message);
      throw err;
    }
  }
}
