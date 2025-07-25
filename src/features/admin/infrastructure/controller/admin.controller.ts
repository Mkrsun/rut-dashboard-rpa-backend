import { Request, Response } from 'express';
import { AdminControllerInterface } from './admin.controller.interface';
import { AdminUseCase } from '../../application/admin.usecase';
import { ResponseUtil } from '../../../../shared/utils/response.util';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { CreateAdminRequest, UpdateAdminRequest, LoginRequest, AdminRole } from '../../domain/admin.entity';

export class AdminController implements AdminControllerInterface {
  constructor(private readonly adminUseCase: AdminUseCase) {}

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        ResponseUtil.badRequest(res, 'Email and password are required');
        return;
      }

      const result = await this.adminUseCase.login({ email, password });
      ResponseUtil.success(res, result, 'Login successful');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      ResponseUtil.unauthorized(res, errorMessage);
    }
  }

  public async createAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, email, password, role }: CreateAdminRequest = req.body;

      if (!name || !email || !password || !role) {
        ResponseUtil.badRequest(res, 'Name, email, password, and role are required');
        return;
      }

      if (!Object.values(AdminRole).includes(role)) {
        ResponseUtil.badRequest(res, 'Invalid role specified');
        return;
      }

      const admin = await this.adminUseCase.createAdmin({ name, email, password, role });
      ResponseUtil.created(res, admin, 'Admin created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create admin';
      if (errorMessage.includes('already exists')) {
        ResponseUtil.badRequest(res, errorMessage);
      } else {
        ResponseUtil.error(res, errorMessage);
      }
    }
  }

  public async getAdminById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.badRequest(res, 'Admin ID is required');
        return;
      }

      const admin = await this.adminUseCase.getAdminById(id);
      if (!admin) {
        ResponseUtil.notFound(res, 'Admin not found');
        return;
      }

      ResponseUtil.success(res, admin, 'Admin retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get admin';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getAllAdmins(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await this.adminUseCase.getAllAdmins({
        page,
        limit,
        sortBy,
        sortOrder
      });

      ResponseUtil.success(res, result, 'Admins retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get admins';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async updateAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateAdminRequest = req.body;

      if (!id) {
        ResponseUtil.badRequest(res, 'Admin ID is required');
        return;
      }

      if (updateData.role && !Object.values(AdminRole).includes(updateData.role)) {
        ResponseUtil.badRequest(res, 'Invalid role specified');
        return;
      }

      const admin = await this.adminUseCase.updateAdmin(id, updateData);
      if (!admin) {
        ResponseUtil.notFound(res, 'Admin not found');
        return;
      }

      ResponseUtil.success(res, admin, 'Admin updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update admin';
      if (errorMessage.includes('already exists')) {
        ResponseUtil.badRequest(res, errorMessage);
      } else {
        ResponseUtil.error(res, errorMessage);
      }
    }
  }

  public async deleteAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.badRequest(res, 'Admin ID is required');
        return;
      }

      // Prevent admin from deleting themselves
      if (id === req.user?._id) {
        ResponseUtil.badRequest(res, 'Cannot delete your own account');
        return;
      }

      const deleted = await this.adminUseCase.deleteAdmin(id);
      if (!deleted) {
        ResponseUtil.notFound(res, 'Admin not found');
        return;
      }

      ResponseUtil.success(res, null, 'Admin deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete admin';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        ResponseUtil.unauthorized(res, 'User not authenticated');
        return;
      }

      const admin = await this.adminUseCase.getAdminById(userId);
      if (!admin) {
        ResponseUtil.notFound(res, 'Admin not found');
        return;
      }

      ResponseUtil.success(res, admin, 'Profile retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { newPassword } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        ResponseUtil.unauthorized(res, 'User not authenticated');
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        ResponseUtil.badRequest(res, 'New password must be at least 6 characters long');
        return;
      }

      const admin = await this.adminUseCase.changePassword(userId, newPassword);
      if (!admin) {
        ResponseUtil.notFound(res, 'Admin not found');
        return;
      }

      ResponseUtil.success(res, null, 'Password changed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async toggleAdminStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.badRequest(res, 'Admin ID is required');
        return;
      }

      // Prevent admin from deactivating themselves
      if (id === req.user?._id) {
        ResponseUtil.badRequest(res, 'Cannot change your own status');
        return;
      }

      const admin = await this.adminUseCase.toggleAdminStatus(id);
      if (!admin) {
        ResponseUtil.notFound(res, 'Admin not found');
        return;
      }

      const statusMessage = admin.isActive ? 'activated' : 'deactivated';
      ResponseUtil.success(res, admin, `Admin ${statusMessage} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle admin status';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getActiveAdmins(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const admins = await this.adminUseCase.getActiveAdmins();
      ResponseUtil.success(res, admins, 'Active admins retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get active admins';
      ResponseUtil.error(res, errorMessage);
    }
  }
}
