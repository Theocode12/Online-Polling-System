import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
  constructor(private readonly dateFields: string[]) {} // Allow dynamic date fields

  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    
    if (request.body) {
      this.dateFields.forEach((field) => {
        if (request.body[field]) {
          const parsedDate = new Date(request.body[field]);

          if (isNaN(parsedDate.getTime())) {
            throw new BadRequestException(`${field} must be a valid date string`);
          }

          request.body[field] = parsedDate;
        }
      });
    }

    return next.handle();
  }
}
