export enum RolesTypes {
  'PRACTITIONER' = 'practitioner',
  'PATIENT' = 'patient',
  'ADMIN' = 'admin',
}

export interface TokenPayload {
  user: UserData;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  roles: string;
}
