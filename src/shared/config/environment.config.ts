import dotenv from 'dotenv';

dotenv.config();

export class EnvironmentConfig {
  public static readonly PORT: number = parseInt(process.env.PORT || '3000', 10);
  public static readonly NODE_ENV: string = process.env.NODE_ENV || 'development';
  
  // Database
  public static readonly MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/rut-dashboard';
  
  // JWT
  public static readonly JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-key';
  public static readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
  
  // CORS
  public static readonly CORS_ORIGIN: string = process.env.CORS_ORIGIN || 'http://localhost:3000';
  
  // External Services
  public static readonly EXTERNAL_RUT_PROCESS_API_URL: string = process.env.EXTERNAL_RUT_PROCESS_API_URL || 'https://api.external-service.com/process-rut';
  public static readonly EXTERNAL_API_TOKEN: string = process.env.EXTERNAL_API_TOKEN || '';
  public static readonly EXTERNAL_API_TIMEOUT: number = parseInt(process.env.EXTERNAL_API_TIMEOUT || '30000', 10);
  
  public static readonly isDevelopment: boolean = EnvironmentConfig.NODE_ENV === 'development';
  public static readonly isProduction: boolean = EnvironmentConfig.NODE_ENV === 'production';
}
