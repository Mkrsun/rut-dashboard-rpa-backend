import { Router } from 'express';
import { RutProcessResultController } from './rutProcessResult.controller';
import { RutProcessResultUseCase } from '../application/rutProcessResult.usecase';
import { RutProcessResultRepositoryImpl } from './repository/rutProcessResult.repository.impl';
import { AuthMiddleware } from '../../../shared/middleware/auth.middleware';
import { AdminRole } from '../../admin/domain/admin.entity';

export class RutProcessResultRoutes {
  private router: Router;
  private rutProcessResultController: RutProcessResultController;

  constructor() {
    this.router = Router();
    this.initializeDependencies();
    this.initializeRoutes();
  }

  private initializeDependencies(): void {
    // Dependency injection setup
    const rutProcessResultRepository = new RutProcessResultRepositoryImpl();
    const rutProcessResultUseCase = new RutProcessResultUseCase(rutProcessResultRepository);
    this.rutProcessResultController = new RutProcessResultController(rutProcessResultUseCase);
  }

  private initializeRoutes(): void {
    // All routes require authentication
    this.router.use(AuthMiddleware.authenticate);

    // Statistics route (accessible by all authenticated admins)
    this.router.get('/stats', this.rutProcessResultController.getResultStats.bind(this.rutProcessResultController));

    // Search results
    this.router.get('/search', this.rutProcessResultController.searchResults.bind(this.rutProcessResultController));

    // Get current user's results
    this.router.get('/my-results', this.rutProcessResultController.getMyResults.bind(this.rutProcessResultController));

    // Get results by RUT
    this.router.get('/by-rut/:rut', this.rutProcessResultController.getResultsByRut.bind(this.rutProcessResultController));

    // CRUD operations
    this.router.post('/', this.rutProcessResultController.createResult.bind(this.rutProcessResultController));

    this.router.get(
      '/',
      AuthMiddleware.authorize([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]),
      this.rutProcessResultController.getAllResults.bind(this.rutProcessResultController)
    );

    this.router.get('/:id', this.rutProcessResultController.getResultById.bind(this.rutProcessResultController));

    this.router.put('/:id', this.rutProcessResultController.updateResult.bind(this.rutProcessResultController));

    this.router.delete('/:id', this.rutProcessResultController.deleteResult.bind(this.rutProcessResultController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
