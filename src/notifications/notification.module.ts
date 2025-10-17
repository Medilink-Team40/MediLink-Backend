import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './entities/notification.entitie';
import { EmailProcessor } from 'src/processors/email.processor';
import { SmsProcessor } from 'src/processors/sms.processor';
import { PushProcessor } from 'src/processors/push.processor';
import { TwilioService } from './twilio.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NotificationEntity]),
    BullModule.registerQueueAsync({
      name: 'notifications',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    EmailProcessor,
    SmsProcessor,
    PushProcessor,
    TwilioService,
    NodemailerService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
