import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface AdminControllerInterface {
  login(req: Request, res: Response): Promise<void>;
  createAdmin(req: AuthenticatedRequest, res: Response): Promise<void>;
  getAdminById(req: AuthenticatedRequest, res: Response): Promise<void>;
  getAllAdmins(req: AuthenticatedRequest, res: Response): Promise<void>;
  updateAdmin(req: AuthenticatedRequest, res: Response): Promise<void>;
  deleteAdmin(req: AuthenticatedRequest, res: Response): Promise<void>;
  getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
  changePassword(req: AuthenticatedRequest, res: Response): Promise<void>;
  toggleAdminStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
  getActiveAdmins(req: AuthenticatedRequest, res: Response): Promise<void>;
}
