import { Request, Response } from 'express';
import { ProcessRutControllerInterface } from './processRut.controller.interface';
import { ProcessRutUseCase } from '../../application/processRut.usecase';
import { ProcessRutRequestBody } from '../processRut.schema';
import { ResponseUtil } from '../../../../shared/utils/response.util';

export class ProcessRutController implements ProcessRutControllerInterface {
  constructor(
    private readonly processRutUseCase: ProcessRutUseCase
  ) {}

  public async processRut(
    req: Request<{}, {}, ProcessRutRequestBody>,
    res: Response
  ): Promise<void> {
    try {
      const { rut } = req.body;

      console.log(`Processing RUT: ${rut}`);

      const result = await this.processRutUseCase.processRut({ rut });

      if (result.success) {
        ResponseUtil.success(res, result, 'RUT processed successfully');
      } else {
        ResponseUtil.badRequest(res, result.message || 'Failed to process RUT');
      }
    } catch (error) {
      console.error('Error in ProcessRutController.processRut:', error);
      ResponseUtil.error(
        res,
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }
}
