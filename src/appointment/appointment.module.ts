import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Practitioner } from '../practitioner/entities';
import { NotificationModule } from '../notifications/notification.module';
import { CalendarEntity } from '../calendar/entity/calendar.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity, Practitioner, CalendarEntity]), NotificationModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
