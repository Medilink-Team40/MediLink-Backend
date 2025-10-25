import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';



export type NotificationChannel = 'email' | 'sms' | 'push';
export type NotificationStatus = 'queued' | 'processing' | 'sent' | 'failed';

@Entity('notifications')
@Index(['recipient'])
@Index(['status'])
@Index(['type'])
export class NotificationEntity {
  @ApiProperty({ description: 'ID único de la notificación' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Tipo de notificación' })
  @Column()
  type: string;

  @ApiProperty({ description: 'Destinatario de la notificación' })
  @Column()
  recipient: string;

  @ApiProperty({
    enum: ['email', 'sms', 'push'],
    description: 'Canal de envío de la notificación',
  })
  @Column({ type: 'varchar' })
  channel: NotificationChannel;

  @ApiProperty({
    type: 'object',
    description: 'Carga útil (payload) de la notificación',
    additionalProperties: true,
  })
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @ApiProperty({
    enum: ['queued', 'processing', 'sent', 'failed'],
    description: 'Estado actual de la notificación',
  })
  @Column({ type: 'varchar', default: 'queued' })
  status: NotificationStatus;

  @ApiProperty({
    description: 'Mensaje de error en caso de fallo',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  error?: string;

  // ✅ Nuevo campo para marcar si la notificación fue leída
  @ApiProperty({ description: 'Indica si la notificación fue leída', default: false })
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  // ✅ Nuevo campo para registrar cuándo se leyó
  @ApiProperty({ description: 'Fecha en que la notificación fue leída', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @ApiProperty({ description: 'Fecha de creación de la notificación' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la notificación',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
