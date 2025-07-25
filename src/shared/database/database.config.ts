import mongoose from 'mongoose';
import { EnvironmentConfig } from '../config/environment.config';

export class DatabaseConfig {
  public static async connect(): Promise<void> {
    try {
      await mongoose.connect(EnvironmentConfig.MONGODB_URI);
      console.log('✅ Database connected successfully');
      
      mongoose.connection.on('error', (error) => {
        console.error('❌ Database connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Database disconnected');
      });
      
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      process.exit(1);
    }
  }
  
  public static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error);
    }
  }
}
