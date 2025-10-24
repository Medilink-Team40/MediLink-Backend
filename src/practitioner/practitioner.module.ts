import { Module } from '@nestjs/common';
import { PractitionerController } from './controllers/practitioner.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { PractitionerService } from './service/practitioner/practitioner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Practitioner,
  PractitionerIdentifier,
  PractitionerQualification,
  PractitionerTelecom,
} from './entities';
import { KeyCloakService } from 'src/keycloak/services/create/create.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    KeycloakModule,
    TypeOrmModule.forFeature([
      Practitioner,
      PractitionerIdentifier,
      PractitionerQualification,
      PractitionerTelecom,
    ]),
  ],
  controllers: [PractitionerController],
  providers: [KeyCloakService, PractitionerService],
  exports: [PractitionerService],
})
export class PractitionerModule {}
