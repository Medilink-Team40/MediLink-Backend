import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `https://keycloak-production-2d31.up.railway.app/realms/MediLink/protocol/openid-connect/certs`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
      }),
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Extraer roles de forma segura
    let roles: string[] = [];

    // Intentar obtener roles del resource_access
    if (payload.resource_access?.['medilink-frontend']?.roles) {
      roles = payload.resource_access['medilink-frontend'].roles;
    }
    // Fallback: intentar obtener de realm_access
    else if (payload.realm_access?.roles) {
      roles = payload.realm_access.roles;
    }
    // Fallback: si hay un campo roles directo
    else if (payload.roles) {
      roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
    }

    console.log('JWT Payload validado:', {
      sub: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: roles
    });

    return {
      id: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      roles: roles
    };
  }
}
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Injectable } from '@nestjs/common';
// import { passportJwtSecret } from 'jwks-rsa';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(private readonly config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKeyProvider: passportJwtSecret({
//         jwksUri: `https://keycloak-production-2d31.up.railway.app/realms/MediLink/protocol/openid-connect/certs`,
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//       }),
//     });
//   }

//   async validate(payload: any) {
//     return {
//       id: payload.sub,
//       username: payload.preferred_username,
//       email: payload.email,
//       roles: payload.resource_access['medilink-frontend'].roles,
//     };
//   }
// }
