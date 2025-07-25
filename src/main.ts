import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { EnvironmentConfig } from './shared/config/environment.config';
import { DatabaseConfig } from './shared/database/database.config';
import { AdminRoutes } from './features/admin/infrastructure/admin.routes';
import { RutProcessResultRoutes } from './features/rutProcessResult/infrastructure/rutProcessResult.routes';
import { ProcessRutRoutes } from './features/processRut/infrastructure/processRut.routes';
import { TestRoutes } from './features/test/test.routes';
import { ResponseUtil } from './shared/utils/response.util';

export class App {
  private app: Application;
  private adminRoutes: AdminRoutes;
  private rutProcessResultRoutes: RutProcessResultRoutes;
  private processRutRoutes: ProcessRutRoutes;
  private testRoutes: TestRoutes;

  constructor() {
    this.app = express();
    this.adminRoutes = new AdminRoutes();
    this.rutProcessResultRoutes = new RutProcessResultRoutes();
    this.processRutRoutes = new ProcessRutRoutes();
    this.testRoutes = new TestRoutes();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: EnvironmentConfig.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Logging middleware
    if (EnvironmentConfig.isDevelopment) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      ResponseUtil.success(res, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: EnvironmentConfig.NODE_ENV,
        version: '1.0.0'
      }, 'Server is running successfully');
    });

    // API routes
    this.app.use('/api/v1/admin', this.adminRoutes.getRouter());
    this.app.use('/api/v1/rut-results', this.rutProcessResultRoutes.getRouter());
    this.app.use('/api/v1/process-rut', this.processRutRoutes.getRouter());
    
    // Test routes (temporal para testing) - COMENTADO TEMPORALMENTE
    this.app.use('/api/v1/test', this.testRoutes.getRouter());

    // 404 handler for undefined routes
    // this.app.use('*', (req: Request, res: Response) => {
    //   ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
    // });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Global Error Handler:', error);
      
      // Mongoose validation error
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values((error as any).errors).map((val: any) => val.message);
        ResponseUtil.badRequest(res, 'Validation Error', validationErrors.join(', '));
        return;
      }

      // Mongoose duplicate key error
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        const field = Object.keys((error as any).keyValue)[0];
        ResponseUtil.badRequest(res, `Duplicate value for ${field}`);
        return;
      }

      // JWT errors
      if (error.name === 'JsonWebTokenError') {
        ResponseUtil.unauthorized(res, 'Invalid token');
        return;
      }

      if (error.name === 'TokenExpiredError') {
        ResponseUtil.unauthorized(res, 'Token expired');
        return;
      }

      // Cast error (invalid ObjectId)
      if (error.name === 'CastError') {
        ResponseUtil.badRequest(res, 'Invalid ID format');
        return;
      }

      // Default server error
      ResponseUtil.error(res, 
        EnvironmentConfig.isDevelopment ? error.message : 'Internal Server Error',
        500,
        EnvironmentConfig.isDevelopment ? error.stack : undefined
      );
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Connect to database
      await DatabaseConfig.connect();
      
      // Create default super admin if none exists
      await this.createDefaultSuperAdmin();
      
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      process.exit(1);
    }
  }

  private async createDefaultSuperAdmin(): Promise<void> {
    try {
      const { AdminModel } = await import('./features/admin/infrastructure/admin.schema');
      const { AdminRole } = await import('./features/admin/domain/admin.entity');
      const bcrypt = await import('bcryptjs');

      // Check if any super admin exists
      const existingSuperAdmin = await AdminModel.findOne({ role: AdminRole.SUPER_ADMIN });
      
      if (!existingSuperAdmin) {
        const defaultPassword = 'admin123456';
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        
        await AdminModel.create({
          name: 'Super Administrator',
          email: 'admin@rutdashboard.com',
          password: hashedPassword,
          role: AdminRole.SUPER_ADMIN,
          isActive: true
        });

        console.log('🔑 Default Super Admin created:');
        console.log('   Email: admin@rutdashboard.com');
        console.log('   Password: admin123456');
        console.log('   ⚠️  Please change the default password after first login!');
      }
    } catch (error) {
      console.error('Failed to create default super admin:', error);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}
