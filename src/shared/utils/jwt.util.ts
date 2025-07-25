import jwt from 'jsonwebtoken';
import { EnvironmentConfig } from '../config/environment.config';

export interface JwtPayload {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export class JwtUtil {
  public static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, EnvironmentConfig.JWT_SECRET);
  }

  public static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, EnvironmentConfig.JWT_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  public static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
