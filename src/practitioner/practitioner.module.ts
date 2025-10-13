import { Module } from '@nestjs/common';
import { PractitionerController } from './controllers/practitioner.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { PRACTITIONER_REPOSITORY } from './practitioner.dao';
import { PractitionerRepository } from './practitioner.repository';

@Module({
  imports: [KeycloakModule],
  controllers: [PractitionerController],
  providers: [
    {
      provide: PRACTITIONER_REPOSITORY,
      useClass: PractitionerRepository,
    },
  ],
  exports: [PRACTITIONER_REPOSITORY],
})
export class PractitionerModule {}
