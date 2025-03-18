import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@Injectable()
export class SwaggerAuthInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const isPublic = this.reflector.get<boolean>('isPublic', handler);

    if (!isPublic) {
      ApiBearerAuth()(handler);
    }

    return next.handle();
  }
}
