import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NotificationEntity } from 'src/notifications/entities/notification.entity';

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
      entities: [join(__dirname, '../**/*.entity.{ts,js}')],
      migrations: [join(__dirname, '/../migrations/*.{ts,js}')],
      logging: !isProduction,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };
  }
}
