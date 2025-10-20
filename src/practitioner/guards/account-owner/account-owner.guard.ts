import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AccountOwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userLoggedId = request.user.id;
    const sendedId = request.params.id;

    return !!userLoggedId && !!sendedId && userLoggedId == sendedId;
  }
}
