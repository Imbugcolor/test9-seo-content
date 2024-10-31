import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormat } from '../interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'An unexpected error occurred';

    // Structure the response format
    const errorResponse: ResponseFormat<null> = {
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'An unexpected error occurred',
      data: null,
    };

    // Send the custom error response
    response.status(status).json(errorResponse);
  }
}
