import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

export class ResponseUtil {
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(response);
  }

  public static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error
    };
    return res.status(statusCode).json(response);
  }

  public static badRequest(
    res: Response,
    message: string = 'Bad Request',
    error?: string
  ): Response {
    return this.error(res, message, 400, error);
  }

  public static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return this.error(res, message, 401);
  }

  public static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  public static notFound(
    res: Response,
    message: string = 'Not Found'
  ): Response {
    return this.error(res, message, 404);
  }

  public static created<T>(
    res: Response,
    data: T,
    message: string = 'Created'
  ): Response {
    return this.success(res, data, message, 201);
  }
}
