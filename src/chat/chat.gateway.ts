import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'user' | 'ai';
  message: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface UserSession {
  sessionId: string;
  socketId: string;
  userId?: string;
  email?: string;
  userName?: string;
  isAuthenticated: boolean;
  createdAt: Date;
  messages: ChatMessage[];
  userData?: {
    age?: number;
    symptoms?: string[];
    medicalHistory?: string[];
    currentMedications?: string[];
    allergies?: string[];
  };
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly sessions = new Map<string, UserSession>();
  private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  constructor(private readonly httpService: HttpService) {}

  afterInit(server: Server) {
    this.logger.log('✅ Chat WebSocket Gateway inicializado');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`👤 Cliente conectado: ${socket.id}`);

    // Enviar confirmación de conexión
    socket.emit('connected', {
      message: 'Conectado al servidor de chat',
      socketId: socket.id,
      timestamp: new Date(),
    });

    // Generar saludo inicial del IA
    this.sendWelcomeMessage(socket);
  }

  handleDisconnect(socket: Socket) {
    const session = Array.from(this.sessions.values()).find((s) => s.socketId === socket.id);

    if (session) {
      this.logger.log(`👋 Cliente desconectado: ${socket.id} (Session: ${session.sessionId})`);
      this.sessions.delete(session.sessionId);
    }
  }

  @SubscribeMessage('chat:init')
  handleChatInit(socket: Socket, data: { userId?: string; email?: string; userName?: string }) {
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session: UserSession = {
      sessionId,
      socketId: socket.id,
      userId: data.userId,
      email: data.email,
      userName: data.userName,
      isAuthenticated: !!data.userId,
      createdAt: new Date(),
      messages: [],
      userData: {},
    };

    this.sessions.set(sessionId, session);

    this.logger.log(`📋 Nueva sesión de chat: ${sessionId} - Autenticado: ${session.isAuthenticated}`);

    socket.emit('chat:initialized', {
      sessionId,
      message: 'Sesión de chat iniciada',
      timestamp: new Date(),
    });

    // Enviar mensaje de bienvenida personalizado
    this.sendPersonalizedWelcome(socket, session);
  }

  @SubscribeMessage('message:send')
  async handleMessage(socket: Socket, data: { sessionId: string; message: string }) {
    const session = this.sessions.get(data.sessionId);

    if (!session) {
      socket.emit('error', { message: 'Sesión no encontrada' });
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: socket.id,
      senderType: 'user',
      message: data.message,
      timestamp: new Date(),
      userId: session.userId,
      sessionId: data.sessionId,
    };

    session.messages.push(userMessage);

    // Emitir mensaje del usuario a todos en la sala
    socket.emit('message:received', userMessage);

    this.logger.log(`💬 Mensaje recibido [${session.sessionId}]: ${data.message.substring(0, 50)}...`);

    // Enviar a N8N y obtener respuesta de IA
    try {
      const aiResponse = await this.getAIResponse(data.message, session);

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        senderId: 'ai-agent',
        senderType: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        sessionId: data.sessionId,
      };

      session.messages.push(aiMessage);

      // Emitir respuesta del IA
      socket.emit('message:received', aiMessage);

      this.logger.log(`🤖 Respuesta IA [${session.sessionId}]: ${aiResponse.substring(0, 50)}...`);
    } catch (error) {
      this.logger.error(`❌ Error obteniendo respuesta IA: ${error.message}`);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        senderId: 'ai-agent',
        senderType: 'ai',
        message: 'Disculpe, tuve un problema procesando su mensaje. Por favor intente de nuevo.',
        timestamp: new Date(),
        sessionId: data.sessionId,
      };

      socket.emit('message:received', errorMessage);
    }
  }

  @SubscribeMessage('user:updateData')
  handleUpdateUserData(socket: Socket, data: { sessionId: string; userData: any }) {
    const session = this.sessions.get(data.sessionId);

    if (!session) {
      socket.emit('error', { message: 'Sesión no encontrada' });
      return;
    }

    session.userData = { ...session.userData, ...data.userData };

    this.logger.log(`📝 Datos del usuario actualizados [${session.sessionId}]: ${JSON.stringify(data.userData)}`);

    socket.emit('user:dataUpdated', {
      message: 'Datos actualizados',
      userData: session.userData,
    });
  }

  @SubscribeMessage('chat:history')
  handleGetHistory(socket: Socket, data: { sessionId: string }) {
    const session = this.sessions.get(data.sessionId);

    if (!session) {
      socket.emit('error', { message: 'Sesión no encontrada' });
      return;
    }

    socket.emit('chat:history', {
      sessionId: data.sessionId,
      messages: session.messages,
      totalMessages: session.messages.length,
    });

    this.logger.log(`📜 Historial solicitado [${data.sessionId}]: ${session.messages.length} mensajes`);
  }

  @SubscribeMessage('chat:typing')
  handleTyping(socket: Socket, data: { sessionId: string }) {
    const session = this.sessions.get(data.sessionId);
    if (session) {
      socket.broadcast.emit('chat:userTyping', {
        sessionId: data.sessionId,
        user: session.userName || 'Usuario',
      });
    }
  }

  // Métodos privados

  private sendWelcomeMessage(socket: Socket) {
    socket.emit('message:received', {
      id: `msg-${Date.now()}`,
      senderId: 'ai-agent',
      senderType: 'ai',
      message:
        '¡Hola! Soy tu asistente de IA médica. Estoy aquí para ayudarte a encontrar la cita perfecta según tus necesidades. ¿Puedes contarme qué síntomas o preocupaciones médicas tienes?',
      timestamp: new Date(),
    });
  }

  private sendPersonalizedWelcome(socket: Socket, session: UserSession) {
    let welcomeMessage = `¡Hola ${session.userName || 'Bienvenido'}! Soy tu asistente de IA médica. `;

    if (session.isAuthenticated) {
      welcomeMessage +=
        'Veo que estás autenticado. Puedo ayudarte a encontrar la cita perfecta según tu historial médico y necesidades actuales. ';
    } else {
      welcomeMessage +=
        'Para brindarte una mejor atención, me gustaría conocer más sobre ti. ';
    }

    welcomeMessage +=
      '¿Cuéntame qué síntomas o problemas médicos tienes en este momento?';

    socket.emit('message:received', {
      id: `msg-${Date.now()}`,
      senderId: 'ai-agent',
      senderType: 'ai',
      message: welcomeMessage,
      timestamp: new Date(),
      sessionId: session.sessionId,
    });
  }

  private async getAIResponse(userMessage: string, session: UserSession): Promise<string> {
    if (!this.n8nWebhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL no configurado');
      return 'El servicio de IA no está disponible en este momento.';
    }

    try {
      const payload = {
        message: userMessage,
        sessionId: session.sessionId,
        userId: session.userId,
        email: session.email,
        userName: session.userName,
        isAuthenticated: session.isAuthenticated,
        conversationHistory: session.messages.map((m) => ({
          role: m.senderType === 'user' ? 'user' : 'assistant',
          content: m.message,
        })),
        userData: session.userData,
        timestamp: new Date(),
      };

      this.logger.debug(`📤 Enviando a N8N: ${JSON.stringify(payload).substring(0, 100)}...`);

      const response = await firstValueFrom(this.httpService.post(this.n8nWebhookUrl, payload));

      const aiResponse =
        response.data?.response || response.data?.message || 'Entiendo tu problema. Permíteme procesarlo.';

      // Extraer datos del usuario si el IA los detectó
      if (response.data?.extractedData) {
        session.userData = {
          ...session.userData,
          ...response.data.extractedData,
        };
        this.logger.log(`📊 Datos extraídos: ${JSON.stringify(response.data.extractedData)}`);
      }

      return aiResponse;
    } catch (error) {
      this.logger.error(`❌ Error llamando a N8N: ${error.response?.data?.message || error.message}`);

      return 'Disculpe, tuve un problema procesando su solicitud. Por favor intente de nuevo más tarde.';
    }
  }

  // Método para obtener sesión por ID
  getSession(sessionId: string): UserSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Método para obtener todas las sesiones activas
  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  // Método para obtener estadísticas
  getStats() {
    const sessions = Array.from(this.sessions.values());
    return {
      activeSessions: sessions.length,
      authenticatedUsers: sessions.filter((s) => s.isAuthenticated).length,
      anonymousUsers: sessions.filter((s) => !s.isAuthenticated).length,
      totalMessages: sessions.reduce((sum, s) => sum + s.messages.length, 0),
    };
  }
}
