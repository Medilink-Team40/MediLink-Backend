import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Obtiene una sesión de chat específica
   */
  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Obtiene una sesión de chat por ID' })
  @ApiResponse({ status: 200, description: 'Sesión encontrada' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  getSession(@Param('sessionId') sessionId: string) {
    return this.chatService.getSession(sessionId);
  }

  /**
   * Obtiene todas las sesiones activas
   */
  @Get('sessions')
  @ApiOperation({ summary: 'Obtiene todas las sesiones activas' })
  @ApiResponse({ status: 200, description: 'Lista de sesiones' })
  getAllSessions() {
    return this.chatService.getAllSessions();
  }

  /**
   * Obtiene estadísticas de sesiones
   */
  @Get('stats')
  @ApiOperation({ summary: 'Obtiene estadísticas de sesiones' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  getStats() {
    return this.chatService.getDetailedStats();
  }

  /**
   * Obtiene sesiones de un usuario autenticado
   */
  @Get('users/:userId/sessions')
  @ApiOperation({ summary: 'Obtiene sesiones de un usuario' })
  @ApiResponse({ status: 200, description: 'Sesiones del usuario' })
  getSessionsByUserId(@Param('userId') userId: string) {
    return this.chatService.getSessionsByUserId(userId);
  }

  /**
   * Obtiene historial de chat de una sesión
   */
  @Get('history/:sessionId')
  @ApiOperation({ summary: 'Obtiene el historial de una sesión' })
  @ApiResponse({ status: 200, description: 'Historial' })
  exportChatHistory(@Param('sessionId') sessionId: string) {
    return this.chatService.exportChatHistory(sessionId);
  }

  /**
   * Obtiene historial de usuario
   */
  @Get('users/:userId/history')
  @ApiOperation({ summary: 'Obtiene el historial de chat de un usuario' })
  @ApiResponse({ status: 200, description: 'Historial del usuario' })
  getUserChatHistory(@Param('userId') userId: string) {
    return this.chatService.getUserChatHistory(userId);
  }

  /**
   * Obtiene sesiones anónimas
   */
  @Get('anonymous-sessions')
  @ApiOperation({ summary: 'Obtiene sesiones anónimas' })
  @ApiResponse({ status: 200, description: 'Sesiones anónimas' })
  getAnonymousSessions() {
    return this.chatService.getAnonymousSessions();
  }
}
