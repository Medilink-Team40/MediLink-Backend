import { Module } from '@nestjs/common';
import { PractitionerController } from './controllers/practitioner.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { PRACTITIONER_REPOSITORY } from './practitioner.dao';
import { PractitionerRepository } from './practitioner.repository';
import { PractitionerService } from './service/practitioner/practitioner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practitioner } from './entities';

@Module({
  imports: [KeycloakModule, TypeOrmModule.forFeature([Practitioner])],
  controllers: [PractitionerController],
  providers: [
    {
      provide: PRACTITIONER_REPOSITORY,
      useClass: PractitionerRepository,
    },
    PractitionerService,
  ],
  exports: [PRACTITIONER_REPOSITORY],
})
export class PractitionerModule {}
