import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Practitioner } from 'src/practitioner/entities/practitioner.entity';
import { CalendarEntity } from 'src/calendar/entity/calendar.entity';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity, Practitioner, CalendarEntity]), NotificationModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
