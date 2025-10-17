import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mensaje de bienvenida' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un mensaje de bienvenida.',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
