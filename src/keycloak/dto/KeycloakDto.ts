import { UserBaseCreation } from '@app/types/user.types';
import { Credentials } from '../keycloak.types';
import { RolesTypes } from '@app/auth/auth.types';
import { toKeycloakName } from '@app/practitioner/adapter/toKeycloakName.adapter';

export class KeycloakCreateDto {
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public enabled: boolean = true;
  public credentials: Credentials[];

  constructor(user: UserBaseCreation) {
    const { firstName, lastName } = toKeycloakName(user.name);

    this.username = firstName.replaceAll(' ', '_').toLowerCase();
    this.email = user.email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.credentials = [
      {
        type: 'password',
        value: user.password,
        temporary: false,
      },
    ];
  }
}
