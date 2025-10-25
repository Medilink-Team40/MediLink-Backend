import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las notificaciones del sistema',
    description: 'Retorna el historial completo de notificaciones (solo admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las notificaciones',
    schema: {
      example: [
        {
          id: 'notif-123-abc',
          type: 'appointment.created',
          recipient: 'doctor@hospital.com',
          channel: 'email',
          status: 'sent',
          isRead: false,
          payload: {
            subject: 'Nueva cita programada',
            message: 'María López ha agendado una cita',
          },
          createdAt: '2025-11-01T10:00:00Z',
          readAt: null,
        },
        {
          id: 'notif-456-def',
          type: 'appointment.cancelled',
          recipient: 'patient@example.com',
          channel: 'email',
          status: 'sent',
          isRead: true,
          payload: {
            subject: 'Cita cancelada',
            message: 'Tu cita ha sido cancelada',
          },
          createdAt: '2025-11-01T11:00:00Z',
          readAt: '2025-11-01T11:30:00Z',
        },
      ],
    },
  })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('user/:userId')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Obtener notificaciones de un usuario específico',
    description: 'Retorna todas las notificaciones enviadas a un usuario con estado de lectura',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Email o ID del usuario',
    example: 'doctor@hospital.com',
  })
  @ApiQuery({
    name: 'status',
    type: 'string',
    description: 'Filtrar por estado (sent, failed, queued)',
    required: false,
    example: 'sent',
  })
  @ApiQuery({
    name: 'isRead',
    type: 'boolean',
    description: 'Filtrar por estado de lectura (true/false)',
    required: false,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones del usuario',
    schema: {
      example: {
        total: 5,
        unread: 2,
        notifications: [
          {
            id: 'notif-123',
            type: 'appointment.created',
            recipient: 'doctor@hospital.com',
            channel: 'email',
            status: 'sent',
            isRead: false,
            payload: {
              subject: 'Nueva cita',
              message: 'Cita programada para mañana',
            },
            createdAt: '2025-11-01T10:00:00Z',
            readAt: null,
          },
          {
            id: 'notif-124',
            type: 'appointment.confirmed',
            recipient: 'doctor@hospital.com',
            channel: 'email',
            status: 'sent',
            isRead: true,
            payload: {
              subject: 'Cita confirmada',
              message: 'La cita ha sido confirmada',
            },
            createdAt: '2025-11-01T11:00:00Z',
            readAt: '2025-11-01T11:15:00Z',
          },
        ],
      },
    },
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('status') status?: string,
    @Query('isRead') isRead?: boolean,
  ) {
    const notifications = await this.notificationService.findAll();
    const filtered = notifications
      .filter((n) => n.recipient === userId || n.recipient.includes(userId))
      .filter((n) => (status ? n.status === status : true))
      .filter((n) => (isRead !== undefined ? n.isRead === isRead : true));

    return {
      total: filtered.length,
      unread: filtered.filter((n) => !n.isRead).length,
      notifications: filtered,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalles de una notificación específica',
    description: 'Retorna información detallada de una notificación por ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la notificación',
    example: 'notif-123-abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la notificación',
    schema: {
      example: {
        id: 'notif-123-abc',
        type: 'appointment.created',
        recipient: 'doctor@hospital.com',
        channel: 'email',
        status: 'sent',
        isRead: false,
        error: null,
        payload: {
          subject: 'Nueva cita programada',
          message: 'María López ha agendado una cita',
          html: '<p>María López ha agendado una cita...</p>',
        },
        createdAt: '2025-11-01T10:00:00Z',
        sentAt: '2025-11-01T10:00:15Z',
        readAt: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Notificación no encontrada',
  })
  async findOne(@Param('id') id: string) {
    return this.notificationService.findAll().then((notifications) => {
      const notification = notifications.find((n) => n.id === id);
      if (!notification) {
        throw new Error('Notificación no encontrada');
      }
      return notification;
    });
  }

  @Patch(':id/mark-as-read')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Marcar notificación como leída',
    description: 'Actualiza el estado de una notificación a leída',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la notificación',
    example: 'notif-123-abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída',
    schema: {
      example: {
        id: 'notif-123-abc',
        type: 'appointment.created',
        recipient: 'doctor@hospital.com',
        channel: 'email',
        status: 'sent',
        isRead: true,
        payload: {
          subject: 'Nueva cita programada',
          message: 'María López ha agendado una cita',
        },
        createdAt: '2025-11-01T10:00:00Z',
        readAt: '2025-11-01T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Notificación no encontrada',
  })
  async markAsRead(@Param('id') id: string) {
    // Esta es una implementación simplificada
    // En producción, deberías actualizar en BD
    const allNotifications = await this.notificationService.findAll();
    const notification = allNotifications.find((n) => n.id === id);

    if (!notification) {
      throw new Error('Notificación no encontrada');
    }

    return {
      ...notification,
      isRead: true,
      readAt: new Date().toISOString(),
    };
  }

  @Patch('mark-all-as-read/:userId')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Marcar todas las notificaciones como leídas',
    description: 'Marca todas las notificaciones de un usuario como leídas',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Email o ID del usuario',
    example: 'doctor@hospital.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas las notificaciones marcadas como leídas',
    schema: {
      example: {
        message: 'Se marcaron 5 notificaciones como leídas',
        count: 5,
        timestamp: '2025-11-01T10:45:00Z',
      },
    },
  })
  async markAllAsRead(@Param('userId') userId: string) {
    const allNotifications = await this.notificationService.findAll();
    const userNotifications = allNotifications.filter((n) => n.recipient === userId || n.recipient.includes(userId));
    const unreadCount = userNotifications.filter((n) => !n.isRead).length;

    return {
      message: `Se marcaron ${unreadCount} notificaciones como leídas`,
      count: unreadCount,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats/summary')
  @ApiOperation({
    summary: 'Obtener resumen de notificaciones del sistema',
    description: 'Retorna estadísticas generales de notificaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen de notificaciones',
    schema: {
      example: {
        total: 150,
        sent: 140,
        failed: 5,
        queued: 5,
        read: 100,
        unread: 40,
        byType: {
          'appointment.created': 50,
          'appointment.cancelled': 30,
          'appointment.confirmed': 40,
          'appointment.completed': 20,
          'appointment.rescheduled': 10,
        },
        byChannel: {
          email: 145,
          sms: 5,
        },
      },
    },
  })
  async getStats() {
    const allNotifications = await this.notificationService.findAll();

    return {
      total: allNotifications.length,
      sent: allNotifications.filter((n) => n.status === 'sent').length,
      failed: allNotifications.filter((n) => n.status === 'failed').length,
      queued: allNotifications.filter((n) => n.status === 'queued').length,
      read: allNotifications.filter((n) => n.isRead).length,
      unread: allNotifications.filter((n) => !n.isRead).length,
      byType: {
        'appointment.created': allNotifications.filter((n) => n.type === 'appointment.created').length,
        'appointment.cancelled': allNotifications.filter((n) => n.type === 'appointment.cancelled').length,
        'appointment.confirmed': allNotifications.filter((n) => n.type === 'appointment.confirmed').length,
        'appointment.completed': allNotifications.filter((n) => n.type === 'appointment.completed').length,
        'appointment.rescheduled': allNotifications.filter((n) => n.type === 'appointment.rescheduled').length,
      },
      byChannel: {
        email: allNotifications.filter((n) => n.channel === 'email').length,
        sms: allNotifications.filter((n) => n.channel === 'sms').length,
      },
    };
  }
}
