import { UserBaseCreation } from 'src/types/user.types';
import { Credentials } from '../keycloak.types';
import { RolesTypes } from 'src/auth/auth.types';
import { toKeycloakName } from 'src/practitioner/adapter/toKeycloakName.adapter';

export class KeycloakCreateDto {
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public enabled: boolean = true;
  public credentials: Credentials[];
  public role: RolesTypes;

  constructor(user: UserBaseCreation, role: RolesTypes) {
    const { firstName, lastName } = toKeycloakName(user.name);

    this.username = '';
    this.email = user.email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.credentials = [
      {
        type: 'password',
        value: user.password,
        temporary: false,
      },
    ];
  }
}
