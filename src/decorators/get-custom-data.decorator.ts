import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const KeycloakData = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.user[data] : request.user;
});
