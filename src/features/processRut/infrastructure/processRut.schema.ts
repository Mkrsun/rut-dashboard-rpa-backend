import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../../../shared/utils/response.util';

export interface ProcessRutRequestBody {
  rut: string;
}

export class ProcessRutSchema {
  public static validateProcessRutRequest = (
    req: Request<{}, {}, ProcessRutRequestBody>,
    res: Response,
    next: NextFunction
  ): void => {
    const { rut } = req.body;

    // Validate required fields
    if (!rut) {
      ResponseUtil.badRequest(res, 'RUT is required');
      return;
    }

    // Validate RUT type
    if (typeof rut !== 'string') {
      ResponseUtil.badRequest(res, 'RUT must be a string');
      return;
    }

    // Validate RUT format
    const cleanRut = rut.trim().replace(/[.-]/g, '');
    
    if (cleanRut.length < 8 || cleanRut.length > 9) {
      ResponseUtil.badRequest(res, 'RUT must have between 8 and 9 characters');
      return;
    }

    // Basic format validation
    const rutPattern = /^\d{7,8}[0-9Kk]$/;
    if (!rutPattern.test(cleanRut)) {
      ResponseUtil.badRequest(res, 'Invalid RUT format. Expected format: XXXXXXXX-X');
      return;
    }

    // Set the cleaned RUT back to the request body
    req.body.rut = cleanRut;
    
    next();
  };
}
