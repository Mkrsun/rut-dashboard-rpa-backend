import { BaseEntity } from '../../../shared/types/common.types';

export interface AdminEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: Date;
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin'
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Omit<AdminEntity, 'password'>;
  token: string;
}

export interface AdminResponse extends Omit<AdminEntity, 'password'> {}
