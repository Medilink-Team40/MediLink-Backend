import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesTypes } from 'src/auth/auth.types';
import { KeycloakCreateDto } from 'src/keycloak/dto/KeycloakDto';
import { GetRole, GetToken } from 'src/keycloak/keycloak.types';

@Injectable()
export class CreateService {
  private token: string;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {}

  private async getToken() {
    const params = {
      grant_type: 'client_credentials',
      client_id: this.config.get('KEYCLOAK_ADMIN_CLIENT_ID'),
      client_secret: this.config.get('KEYCLOAK_ADMIN_CLIENT_SECRET'),
    };

    const data = new URLSearchParams(params).toString();
    const response = await this.http
      .post<GetToken>(this.config.get('KEYCLOAK_ADMIN_URL') as string, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .toPromise();

    const token = response?.data.access_token;
    if (!token) {
      throw new Error('token is undefined');
    }

    if (!this.token) {
      this.token = token;
    }

    return token;
  }

  private async getRoleDetails(roleName: RolesTypes): Promise<GetRole> {
    const token = this.token ?? (await this.getToken());
    const realm = this.config.get('KEYCLOAK_TARGET_REALM');
    const clientUuid = this.config.get('KEYCLOAK_ADMIN_CLIENT_UUID');
    const roleUrl = `${this.config.get('KEYCLOAK_BASE_URL')}/admin/realms/${realm}/clients/${clientUuid}/roles/${roleName.toLowerCase()}`;

    const response = await this.http
      .get<GetRole>(roleUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .toPromise();

    if (!response || response.status !== 200) {
      throw new Error(`Error al obtener detalles del rol: ${roleName}`);
    }

    return response.data;
  }

  private async assignRoleToUser(
    userId: string,
    roleName: RolesTypes,
  ): Promise<void> {
    const token = this.token ?? (await this.getToken());
    const roleDetails = await this.getRoleDetails(roleName);
    const realm = this.config.get('KEYCLOAK_TARGET_REALM');
    const clientUuid = this.config.get('KEYCLOAK_ADMIN_CLIENT_UUID');
    const mappingUrl = `${this.config.get('KEYCLOAK_BASE_URL')}/admin/realms/${realm}/users/${userId}/role-mappings/clients/${clientUuid}`;
    const roleBody = [
      {
        id: roleDetails.id,
        name: roleDetails.name,
      },
    ];

    const assignResponse = await this.http
      .post(mappingUrl, roleBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();

    if (!assignResponse || assignResponse.status !== 204) {
      throw new Error(
        `Fallo al asignar el rol ${roleName} al usuario ${userId}. Status: ${assignResponse?.status ?? HttpStatus.INTERNAL_SERVER_ERROR}`,
      );
    }
  }

  public async createUserAndAssignRole(
    user: KeycloakCreateDto,
    role: RolesTypes,
  ): Promise<string> {
    const token = this.token ?? (await this.getToken());
    const realm = this.config.get('KEYCLOAK_TARGET_REALM');
    const userCreationUrl = `${this.config.get('KEYCLOAK_BASE_URL')}/admin/realms/${realm}/users`;
    const createResponse = await this.http
      .post(userCreationUrl, user, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();

    if (!createResponse) throw new Error('');

    const newUserId = createResponse.headers.location.split('/').pop();

    await this.assignRoleToUser(newUserId, role);
    return newUserId;
  }
}
