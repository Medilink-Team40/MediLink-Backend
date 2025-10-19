import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from 'src/notifications/entities/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';

interface PushJobData {
  id: string;
  channel: string;
}

@Processor('notifications')
export class PushProcessor extends WorkerHost {
  constructor(
    @InjectRepository(NotificationEntity)
    private repo: Repository<NotificationEntity>,
    private service: NotificationService,
  ) {
    super();
  }

  async process(job: Job<PushJobData>) {
    const { id, channel } = job.data;
    if (channel !== 'push') return;

    const notification = await this.repo.findOneBy({ id });
    if (!notification) return;

    try {
      // TODO: integrar con Firebase / OneSignal
      console.log(
        `🔔 Enviando push a ${notification.recipient}`,
        notification.payload,
      );

      await this.service.markAsSent(id);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      await this.service.markAsFailed(id, errorMessage);
      throw err;
    }
  }
}
