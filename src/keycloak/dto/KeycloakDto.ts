import { Credentials } from '../keycloak.types';
import { toKeycloakName } from '../../practitioner/adapter/toKeycloakName.adapter';
import { PersonCreation } from '../../types/person.types';

export class KeycloakCreateDto {
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public enabled: boolean = true;
  public credentials: Credentials[];

  constructor(user: PersonCreation) {
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
