import { SetMetadata } from '@nestjs/common';
import { RolesTypes } from '../auth.types';

export const Roles = (...args: RolesTypes[]) => SetMetadata('roles', args);

export const Roles = (...args: string[]) => SetMetadata('roles', args);
