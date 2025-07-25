import { App } from './main';
import { EnvironmentConfig } from './shared/config/environment.config';

class Server {
  private app: App;

  constructor() {
    this.app = new App();
  }

  public async start(): Promise<void> {
    try {
      // Initialize the application
      await this.app.initialize();

      // Start the server
      const server = this.app.getApp().listen(EnvironmentConfig.PORT, () => {
        console.log('🚀 Server Configuration:');
        console.log(`   Port: ${EnvironmentConfig.PORT}`);
        console.log(`   Environment: ${EnvironmentConfig.NODE_ENV}`);
        console.log(`   Database: ${EnvironmentConfig.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
        console.log(`   CORS Origin: ${EnvironmentConfig.CORS_ORIGIN}`);
        console.log('');
        console.log('📡 API Endpoints:');
        console.log(`   Health Check: http://localhost:${EnvironmentConfig.PORT}/health`);
        console.log(`   Admin API: http://localhost:${EnvironmentConfig.PORT}/api/v1/admin`);
        console.log(`   RUT Results API: http://localhost:${EnvironmentConfig.PORT}/api/v1/rut-results`);
        console.log(`   Process RUT API: http://localhost:${EnvironmentConfig.PORT}/api/v1/process-rut`);
        console.log(`   Test API (Temporal): http://localhost:${EnvironmentConfig.PORT}/api/v1/test`);
        console.log('');
        console.log('✅ Server is running successfully!');
      });

      // Graceful shutdown handling
      this.setupGracefulShutdown(server);

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(server: any): void {
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        
        try {
          const { DatabaseConfig } = await import('./shared/database/database.config');
          await DatabaseConfig.disconnect();
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.log('⏰ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      shutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });
  }
}

// Start the server
const server = new Server();
server.start().catch((error) => {
  console.error('💥 Fatal error starting server:', error);
  process.exit(1);
});
