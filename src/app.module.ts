import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PractitionerModule } from './practitioner/practitioner.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { HttpModule } from '@nestjs/axios';
import { PractitionerController } from './practitioner/controllers/practitioner.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PractitionerModule,
    KeycloakModule,
  ],
  controllers: [PractitionerController],
  providers: [AppService],
})
export class AppModule {}
