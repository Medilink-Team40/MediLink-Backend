import { Module } from '@nestjs/common';
import { KeyCloakService } from './services/create/create.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KeyCloakService],
  exports: [KeyCloakService],
})
export class KeycloakModule {}
