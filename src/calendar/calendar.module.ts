import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarEntity } from './entity/calendar.entity';
import { Practitioner } from '../practitioner/entities/practitioner.entity';
import { AppointmentEntity } from '../appointment/entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity, Practitioner, AppointmentEntity])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService, TypeOrmModule.forFeature([AppointmentEntity])],
})
export class CalendarModule {}
