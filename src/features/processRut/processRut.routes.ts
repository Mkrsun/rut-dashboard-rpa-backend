import { Router } from 'express';
import { ProcessRutController } from './infrastructure/controller/processRut.controller';
import { ProcessRutUseCase } from './application/processRut.usecase';
import { ProcessRutService } from './infrastructure/service/processRut.service';
import { ProcessRutSchema } from './infrastructure/processRut.schema';
import { AuthMiddleware } from '../../shared/middleware/auth.middleware';

export class ProcessRutRoutes {
  private router: Router;
  private processRutController: ProcessRutController;

  constructor() {
    this.router = Router();
    this.initializeDependencies();
    this.initializeRoutes();
  }

  private initializeDependencies(): void {
    // Dependency injection setup following clean architecture principles
    const processRutService = new ProcessRutService();
    const processRutUseCase = new ProcessRutUseCase(processRutService);
    this.processRutController = new ProcessRutController(processRutUseCase);
  }

  private initializeRoutes(): void {
    // All routes require authentication
    this.router.use(AuthMiddleware.authenticate);

    // POST /api/v1/process-rut - Process a RUT through external service
    this.router.post(
      '/',
      ProcessRutSchema.validateProcessRutRequest,
      this.processRutController.processRut.bind(this.processRutController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
