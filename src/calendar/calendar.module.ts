import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarEntity } from './entity/calendar.entity';
import { Practitioner } from 'src/practitioner/entities/practitioner.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity, Practitioner, AppointmentEntity])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
