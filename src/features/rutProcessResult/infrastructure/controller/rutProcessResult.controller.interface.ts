import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface RutProcessResultControllerInterface {
  createResult(req: AuthenticatedRequest, res: Response): Promise<void>;
  getResultById(req: AuthenticatedRequest, res: Response): Promise<void>;
  getAllResults(req: AuthenticatedRequest, res: Response): Promise<void>;
  getResultsByRut(req: AuthenticatedRequest, res: Response): Promise<void>;
  getMyResults(req: AuthenticatedRequest, res: Response): Promise<void>;
  updateResult(req: AuthenticatedRequest, res: Response): Promise<void>;
  deleteResult(req: AuthenticatedRequest, res: Response): Promise<void>;
  searchResults(req: AuthenticatedRequest, res: Response): Promise<void>;
  getResultStats(req: AuthenticatedRequest, res: Response): Promise<void>;
}
