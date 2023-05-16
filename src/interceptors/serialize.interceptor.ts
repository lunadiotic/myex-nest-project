import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    console.log('running before handler/controller');

    return next.handle().pipe(
      // Run something after a request is handled by the request handler
      map((data: any) => {
        console.log('running after handler/controller');
      }),
    );
  }
}
