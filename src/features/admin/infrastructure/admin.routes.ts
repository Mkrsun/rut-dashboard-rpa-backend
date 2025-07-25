import { Router } from 'express';
import { AdminController } from './controller/admin.controller';
import { AdminUseCase } from '../application/admin.usecase';
import { AdminRepositoryImpl } from './repository/admin.repository.impl';
import { AuthMiddleware } from '../../../shared/middleware/auth.middleware';
import { AdminRole } from '../domain/admin.entity';

export class AdminRoutes {
  private router: Router;
  private adminController: AdminController;

  constructor() {
    this.router = Router();
    this.initializeDependencies();
    this.initializeRoutes();
  }

  private initializeDependencies(): void {
    // Dependency injection setup
    const adminRepository = new AdminRepositoryImpl();
    const adminUseCase = new AdminUseCase(adminRepository);
    this.adminController = new AdminController(adminUseCase);
  }

  private initializeRoutes(): void {
    // Public routes (no authentication required)
    this.router.post('/login', this.adminController.login.bind(this.adminController));

    // Protected routes (authentication required)
    this.router.use(AuthMiddleware.authenticate);

    // Profile routes (accessible by all authenticated admins)
    this.router.get('/profile', this.adminController.getProfile.bind(this.adminController));
    this.router.put('/change-password', this.adminController.changePassword.bind(this.adminController));

    // Admin management routes (requires admin privileges)
    this.router.get(
      '/active',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]),
      this.adminController.getActiveAdmins.bind(this.adminController)
    );

    this.router.get(
      '/',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]),
      this.adminController.getAllAdmins.bind(this.adminController)
    );

    this.router.get(
      '/:id',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]),
      this.adminController.getAdminById.bind(this.adminController)
    );

    // Super admin only routes
    this.router.post(
      '/',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN]),
      this.adminController.createAdmin.bind(this.adminController)
    );

    this.router.put(
      '/:id',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN]),
      this.adminController.updateAdmin.bind(this.adminController)
    );

    this.router.delete(
      '/:id',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN]),
      this.adminController.deleteAdmin.bind(this.adminController)
    );

    this.router.patch(
      '/:id/toggle-status',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN]),
      this.adminController.toggleAdminStatus.bind(this.adminController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
