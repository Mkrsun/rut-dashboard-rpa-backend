import { Request, Response } from 'express';

export interface ProcessRutControllerInterface {
  processRut(req: Request, res: Response): Promise<void>;
}
