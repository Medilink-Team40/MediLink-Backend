import { Controller, Get, Request } from '@nestjs/common';
import { CatchError } from 'src/decorators/errors.decorator';
import { QualificationService } from 'src/practitioner/service/qualification/qualification.service';

@Controller('qualification')
export class QualificationController {
  constructor(private readonly service: QualificationService) {}

  @Get('all')
  @CatchError()
  public async getAllQualifications() {
    const qualifications = await this.service.getAllQualifications();
    return qualifications;
  }
}
