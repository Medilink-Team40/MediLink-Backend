import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, params, query } = req;

        this.logger.log(`Incoming Request: ${method} ${url}`);
        this.logger.debug(`Body: ${JSON.stringify(body)}`);
        this.logger.debug(`Params: ${JSON.stringify(params)}`);
        this.logger.debug(`Query: ${JSON.stringify(query)}`);

        const now = Date.now();
        return next.handle().pipe(
            tap((response) => {
                this.logger.log(
                    `Response for ${method} ${url} - ${Date.now() - now}ms: ${JSON.stringify(
                        response,
                    )}`,
                );
            }),
        );
    }
}
