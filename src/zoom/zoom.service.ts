// src/zoom/zoom.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as jwt from 'jsonwebtoken';
// import * as dotenv from 'dotenv';
// import { env } from 'process';

export interface ZoomMeeting {
  id: number;
  uuid: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  join_url: string;
  start_url: string;
}

export interface ZoomUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  pic_url: string;
  role_id: number;
  prov_id: string;
}

export interface CreateMeetingDto {
  topic: string;
  type: 2 | 3;
  start_time: string;
  duration: number;
  timezone: string;
  agenda?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    waiting_room?: boolean;
  };
}

const accessToken = process.env.ZOOM_SECRET_TOKEN as string;
@Injectable()
export class ZoomService {
  private readonly logger = new Logger(ZoomService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly zoomAccountId = process.env.ZOOM_ACCOUNT_ID;
  private readonly zoomClientId = process.env.ZOOM_CLIENT_ID;
  private readonly zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.zoom.us/v2',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Obtiene un token de acceso válido
   */
  private async getAccessToken(): Promise<string> {
    // Si tenemos un token válido, lo retornamos
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      this.logger.debug('🔑 Generando nuevo token de acceso Zoom');

      // Crear JWT para Zoom
      const payload = {
        iss: this.zoomClientId,
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
      };

      const zoomJwt = jwt.sign(payload, this.zoomClientSecret as string);

      // Obtener access token
      const response = await axios.post(
        'https://zoom.us/oauth/token',
        {
          grant_type: 'account_credentials',
          account_id: this.zoomAccountId,
        },
        {
          headers: {
            Authorization: `Bearer ${zoomJwt}`,
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      this.logger.debug('✅ Token de acceso obtenido exitosamente');
      return this.accessToken as string;
    } catch (error) {
      this.logger.error('❌ Error obteniendo token de Zoom:', error);
      throw new BadRequestException('No se pudo autenticar con Zoom');
    }
  }

  /**
   * Crea una reunión de Zoom
   */
  public async createMeeting(
    userId: string,
    meetingData: CreateMeetingDto,
  ): Promise<ZoomMeeting> {
    try {
      const accessToken = await this.getAccessToken();

      this.logger.debug(`📅 Creando reunión: ${meetingData.topic}`);

      const response = await this.axiosInstance.post(
        `/users/${userId}/meetings`,
        {
          topic: meetingData.topic,
          type: meetingData.type,
          start_time: meetingData.start_time,
          duration: meetingData.duration,
          timezone: meetingData.timezone,
          agenda: meetingData.agenda,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            waiting_room: false,
            meeting_authentication: false,
            ...meetingData.settings,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      this.logger.log(`✅ Reunión creada: ${response.data.id} - ${response.data.join_url}`);

      return response.data;
    } catch (error: any) {
      this.logger.error(`❌ Error creando reunión: ${error.message}`);
      throw new BadRequestException(
        error.response?.data?.message || 'Error creando reunión en Zoom',
      );
    }
  }

  /**
   * Obtiene detalles de una reunión
   */
  public async getMeeting(userId: string, meetingId: number): Promise<ZoomMeeting> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get(
        `/users/${userId}/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(`❌ Error obteniendo reunión: ${error.message}`);
      throw new BadRequestException('No se pudo obtener la reunión');
    }
  }

  /**
   * Actualiza una reunión
   */
  public async updateMeeting(
    userId: string,
    meetingId: number,
    meetingData: Partial<CreateMeetingDto>,
  ): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      this.logger.debug(`📝 Actualizando reunión: ${meetingId}`);

      await this.axiosInstance.patch(
        `/users/${userId}/meetings/${meetingId}`,
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      this.logger.log(`✅ Reunión actualizada: ${meetingId}`);
    } catch (error: any) {
      this.logger.error(`❌ Error actualizando reunión: ${error.message}`);
      throw new BadRequestException('Error actualizando reunión');
    }
  }

  /**
   * Elimina una reunión
   */
  public async deleteMeeting(userId: string, meetingId: number): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      this.logger.debug(`🗑️ Eliminando reunión: ${meetingId}`);

      await this.axiosInstance.delete(
        `/users/${userId}/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      this.logger.log(`✅ Reunión eliminada: ${meetingId}`);
    } catch (error: any) {
      this.logger.error(`❌ Error eliminando reunión: ${error.message}`);
      throw new BadRequestException('Error eliminando reunión');
    }
  }

  /**
   * Obtiene las reuniones de un usuario
   */
  public async getUserMeetings(userId: string): Promise<ZoomMeeting[]> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get(
        `/users/${userId}/meetings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.meetings || [];
    } catch (error: any) {
      this.logger.error(`❌ Error obteniendo reuniones: ${error.message}`);
      return [];
    }
  }

  /**
   * Obtiene información del usuario en Zoom
   */
  public async getZoomUser(userId: string): Promise<ZoomUser> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get(
        `/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(`❌ Error obteniendo usuario Zoom: ${error.message}`);
      throw new BadRequestException('No se pudo obtener información del usuario');
    }
  }

  /**
   * Obtiene la grabación de una reunión
   */
  public async getMeetingRecordings(meetingId: number): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get(
        `/meetings/${meetingId}/recordings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(`❌ Error obteniendo grabaciones: ${error.message}`);
      return null;
    }
  }

  /**
   * Genera URL de inicio de sesión para un usuario (para iniciar una reunión)
   */
  public getStartUrl(zoomUser: string, meetingId: number): string {
    // Para iniciar desde backend, usamos el JWT
    // En el frontend, el usuario accede directamente a join_url
    return `https://zoom.us/wc/join/${meetingId}`;
  }

  /**
   * Formatea una fecha para Zoom (ISO 8601)
   */
  public formatDateForZoom(date: Date): string {
    return date.toISOString();
  }
}
