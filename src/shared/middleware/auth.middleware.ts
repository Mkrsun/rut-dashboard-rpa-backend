import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { ResponseUtil } from '../utils/response.util';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class AuthMiddleware {
  public static authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ResponseUtil.unauthorized(res, 'Access token is required');
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const payload = JwtUtil.verifyToken(token);

      if (!payload) {
        ResponseUtil.unauthorized(res, 'Invalid or expired token');
        return;
      }

      req.user = payload;
      next();
    } catch (error) {
      ResponseUtil.unauthorized(res, 'Authentication failed');
    }
  }

  public static authorize(roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        ResponseUtil.unauthorized(res, 'Authentication required');
        return;
      }

      if (!roles.includes(req.user.role)) {
        ResponseUtil.forbidden(res, 'Insufficient permissions');
        return;
      }

      next();
    };
  }
}
