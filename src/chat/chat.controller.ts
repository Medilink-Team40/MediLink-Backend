import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesTypes } from 'src/auth/auth.types';
import { UserSession, ChatMessage } from './chat.gateway';

interface UserChatHistoryItem {
  sessionId: string;
  createdAt: Date;
  totalMessages: number;
  lastMessage: string | null;
  userData?: {
    age?: number;
    symptoms?: string[];
    medicalHistory?: string[];
    currentMedications?: string[];
    allergies?: string[];
  };
}

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  @ApiOperation({
    summary: 'Obtener todas las sesiones de chat activas',
    description: 'Retorna todas las sesiones de chat del sistema (solo admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sesiones activas',
    schema: {
      example: [
        {
          sessionId: '1730484000000-abc123',
          socketId: 'socket-id-123',
          userId: 'user-uuid',
          email: 'user@example.com',
          userName: 'Juan García',
          isAuthenticated: true,
          createdAt: '2025-11-01T10:00:00Z',
          messages: [
            {
              id: 'msg-1',
              senderId: 'socket-id-123',
              senderType: 'user',
              message: 'Tengo dolor de cabeza',
              timestamp: '2025-11-01T10:00:05Z',
            },
            {
              id: 'msg-2-ai',
              senderId: 'ai-agent',
              senderType: 'ai',
              message: 'Entiendo, cuéntame más sobre tu dolor...',
              timestamp: '2025-11-01T10:00:10Z',
            },
          ],
          userData: {
            age: 35,
            symptoms: ['dolor de cabeza', 'mareos'],
            medicalHistory: ['migraña'],
          },
        },
      ],
    },
  })
  getAllSessions(): UserSession[] {
    return this.chatService.getAllSessions();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obtener estadísticas generales del chat',
    description: 'Retorna estadísticas de sesiones y mensajes',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del chat',
    schema: {
      example: {
        activeSessions: 5,
        authenticatedUsers: 3,
        anonymousUsers: 2,
        totalMessages: 45,
      },
    },
  })
  getStats() {
    return this.chatService.getStats();
  }

  @Get('stats/detailed')
  @ApiOperation({
    summary: 'Obtener estadísticas detalladas del chat',
    description: 'Retorna estadísticas completas y análisis de sesiones',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas detalladas',
    schema: {
      example: {
        totalSessions: 150,
        authenticatedSessions: 95,
        anonymousSessions: 55,
        totalMessages: 2400,
        averageMessagesPerSession: 16,
        activeSessions: 5,
        oldestSessionMinutes: 1200,
      },
    },
  })
  getDetailedStats() {
    return this.chatService.getDetailedStats();
  }

  @Get('session/:sessionId')
  @ApiOperation({
    summary: 'Obtener detalles de una sesión de chat',
    description: 'Retorna información completa de una sesión específica',
  })
  @ApiParam({
    name: 'sessionId',
    type: 'string',
    description: 'ID de la sesión de chat',
    example: '1730484000000-abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la sesión',
    schema: {
      example: {
        sessionId: '1730484000000-abc123',
        socketId: 'socket-id-123',
        userId: 'user-uuid',
        email: 'user@example.com',
        userName: 'Juan García',
        isAuthenticated: true,
        createdAt: '2025-11-01T10:00:00Z',
        messages: [],
        userData: {
          age: 35,
          symptoms: ['dolor de cabeza'],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  getSession(@Param('sessionId') sessionId: string) {
    const session = this.chatService.getSession(sessionId);
    if (!session) {
      return { error: 'Sesión no encontrada' };
    }
    return session;
  }

  @Get('history/:sessionId')
  @ApiOperation({
    summary: 'Exportar historial de chat de una sesión',
    description: 'Retorna el historial completo de mensajes de una sesión',
  })
  @ApiParam({
    name: 'sessionId',
    type: 'string',
    description: 'ID de la sesión de chat',
    example: '1730484000000-abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial exportado',
    schema: {
      example: {
        sessionId: '1730484000000-abc123',
        userId: 'user-uuid',
        email: 'user@example.com',
        userName: 'Juan García',
        isAuthenticated: true,
        createdAt: '2025-11-01T10:00:00Z',
        totalMessages: 12,
        userData: {
          age: 35,
          symptoms: ['dolor de cabeza', 'mareos'],
        },
        messages: [
          {
            id: 'msg-1',
            senderId: 'socket-123',
            senderType: 'user',
            message: 'Tengo dolor de cabeza',
            timestamp: '2025-11-01T10:00:05Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  exportChatHistory(@Param('sessionId') sessionId: string):
      {
        sessionId: string;
        userId?: string;
        email?: string;
        userName?: string;
        isAuthenticated: boolean;
        createdAt: Date;
        totalMessages: number;
        userData: any;
        messages: ChatMessage[];
      }
    | { error: string } {
    const history = this.chatService.exportChatHistory(sessionId);
    if (!history) {
      return { error: 'Sesión no encontrada' };
    }
    return history;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesTypes.PRACTITIONER, RolesTypes.ADMIN)
  @Get('user/:userId/history')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Obtener historial de chat de un usuario autenticado',
    description: 'Retorna todas las sesiones de chat de un usuario específico (solo el usuario o admin)',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'ID del usuario',
    example: 'user-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de chats del usuario',
    schema: {
      example: [
        {
          sessionId: '1730484000000-abc123',
          createdAt: '2025-11-01T10:00:00Z',
          totalMessages: 12,
          lastMessage: 'Gracias por tu ayuda',
          userData: {
            age: 35,
            symptoms: ['dolor de cabeza'],
          },
        },
        {
          sessionId: '1730485000000-def456',
          createdAt: '2025-11-01T11:00:00Z',
          totalMessages: 8,
          lastMessage: 'Voy a solicitar la cita',
          userData: {
            age: 35,
            symptoms: ['dolor de garganta'],
          },
        },
      ],
    },
  })
  getUserChatHistory(@Param('userId') userId: string): UserChatHistoryItem[] {
    return this.chatService.getUserChatHistory(userId);
  }

  @Get('anonymous/sessions')
  @ApiOperation({
    summary: 'Obtener todas las sesiones anónimas',
    description: 'Retorna todas las sesiones de usuarios no autenticados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sesiones anónimas',
  })
  getAnonymousSessions() {
    return this.chatService.getAnonymousSessions();
  }
}
