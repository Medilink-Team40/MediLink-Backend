import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Practitioner } from '@app/practitioner/entities';
import { CalendarEntity } from '@app/calendar/entity/calendar.entity';
import { NotificationModule } from '@app/notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity, Practitioner, CalendarEntity]), NotificationModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
