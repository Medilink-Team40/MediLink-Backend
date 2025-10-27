import { Module } from '@nestjs/common';
import { PractitionerController } from './controllers/practitioner.controller';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { PractitionerService } from './service/practitioner/practitioner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom } from './entities';
import { KeyCloakService } from '../keycloak/services/create/create.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { PractitionerUpdaterFactory } from './factory/updater.factory';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    KeycloakModule,
    TypeOrmModule.forFeature([Practitioner, PractitionerIdentifier, PractitionerQualification, PractitionerTelecom]),
  ],
  controllers: [PractitionerController],
  providers: [KeyCloakService, PractitionerService, PractitionerUpdaterFactory],
  exports: [PractitionerService],
})
export class PractitionerModule {}
