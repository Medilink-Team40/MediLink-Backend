import { Injectable, Logger } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly chatGateway: ChatGateway) {}

  /**
   * Obtiene una sesión de chat por ID
   */
  getSession(sessionId: string) {
    return this.chatGateway.getSession(sessionId);
  }

  /**
   * Obtiene todas las sesiones activas
   */
  getAllSessions() {
    return this.chatGateway.getAllSessions();
  }

  /**
   * Obtiene estadísticas de sesiones
   */
  getStats() {
    return this.chatGateway.getStats();
  }

  /**
   * Obtiene sesiones por usuario autenticado
   */
  getSessionsByUserId(userId: string) {
    return this.chatGateway.getAllSessions().filter((session) => session.userId === userId);
  }

  /**
   * Obtiene todas las sesiones no autenticadas
   */
  getAnonymousSessions() {
    return this.chatGateway.getAllSessions().filter((session) => !session.isAuthenticated);
  }

  /**
   * Exporta historial de chat de una sesión
   */
  exportChatHistory(sessionId: string) {
    const session = this.getSession(sessionId);

    if (!session) {
      return null;
    }

    return {
      sessionId: session.sessionId,
      userId: session.userId,
      email: session.email,
      userName: session.userName,
      isAuthenticated: session.isAuthenticated,
      createdAt: session.createdAt,
      totalMessages: session.messages.length,
      userData: session.userData,
      messages: session.messages,
    };
  }

  /**
   * Obtiene todos los chats para un usuario autenticado
   */
  getUserChatHistory(userId: string) {
    const sessions = this.getSessionsByUserId(userId);

    return sessions.map((session) => ({
      sessionId: session.sessionId,
      createdAt: session.createdAt,
      totalMessages: session.messages.length,
      lastMessage: session.messages.length > 0 ? session.messages[session.messages.length - 1].message : null,
      userData: session.userData,
    }));
  }

  /**
   * Calcula estadísticas detalladas
   */
  getDetailedStats() {
    const allSessions = this.chatGateway.getAllSessions();

    const stats = {
      totalSessions: allSessions.length,
      authenticatedSessions: allSessions.filter((s) => s.isAuthenticated).length,
      anonymousSessions: allSessions.filter((s) => !s.isAuthenticated).length,
      totalMessages: allSessions.reduce((sum, s) => sum + s.messages.length, 0),
      averageMessagesPerSession:
        allSessions.length > 0 ? allSessions.reduce((sum, s) => sum + s.messages.length, 0) / allSessions.length : 0,
      activeSessions: allSessions.filter((s) => new Date().getTime() - new Date(s.createdAt).getTime() < 30 * 60 * 1000)
        .length, // últimos 30 minutos
      oldestSession:
        allSessions.length > 0
          ? Math.min(...allSessions.map((s) => new Date().getTime() - new Date(s.createdAt).getTime())) / 1000
          : 0,
    };

    return stats;
  }
}
