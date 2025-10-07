import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NotificationEntity } from 'src/notifications/entities/notification.entitie';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<string>('nodeEnv');
    const isProduction = nodeEnv === 'production';
    const dbUrl = this.configService.get<string>('database.url');

    return {
      type: 'postgres',
      url: dbUrl,
      synchronize: !isProduction,
      entities: [NotificationEntity],
      migrations: [join(__dirname, '/../migrations/*.{ts,js}')],
      logging: !isProduction,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };
  }
}
