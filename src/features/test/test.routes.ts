import { Router } from 'express';
import { TestController } from './test.controller';

export class TestRoutes {
  private router: Router;
  private testController: TestController;

  constructor() {
    this.router = Router();
    this.testController = new TestController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /api/v1/test/process-rut - Simula el servicio externo
    this.router.post(
      '/process-rut',
      this.testController.simulateExternalProcessRut.bind(this.testController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
