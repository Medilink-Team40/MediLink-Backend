import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './entities/notification.entity';
import { EmailProcessor } from '@app/processors/email.processor';
import { SmsProcessor } from '@app/processors/sms.processor';
import { PushProcessor } from '@app/processors/push.processor';
import { TwilioService } from './twilio.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, EmailProcessor, SmsProcessor, PushProcessor, TwilioService, NodemailerService],
  exports: [NotificationService],
})
export class NotificationModule {}
