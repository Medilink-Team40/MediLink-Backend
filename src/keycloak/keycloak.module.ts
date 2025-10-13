import { Module } from '@nestjs/common';
import { CreateService } from './services/create/create.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CreateService],
  exports: [CreateService],
})
export class KeycloakModule {}
