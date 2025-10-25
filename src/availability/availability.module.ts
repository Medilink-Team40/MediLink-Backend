import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AvailabilityRule } from './entity/availability.entity';
import { CalendarEntity } from 'src/calendar/entity/calendar.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityRule, CalendarEntity, AppointmentEntity])],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
