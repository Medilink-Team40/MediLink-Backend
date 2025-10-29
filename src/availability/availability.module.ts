import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AvailabilityRule } from './entity/availability.entity';
import { CalendarEntity } from '../calendar/entity/calendar.entity';
import { AppointmentEntity } from '../appointment/entity/appointment.entity';
import { Practitioner } from '../practitioner/entities/practitioner.entity';
import { PractitionerModule } from '../practitioner/practitioner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailabilityRule, CalendarEntity, AppointmentEntity, Practitioner]),
    PractitionerModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
