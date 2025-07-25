import { AdminEntity, CreateAdminRequest, UpdateAdminRequest } from '../../domain/admin.entity';
import { PaginationOptions, PaginatedResponse } from '../../../../shared/types/common.types';

export interface AdminRepository {
  create(adminData: CreateAdminRequest): Promise<AdminEntity>;
  findById(id: string): Promise<AdminEntity | null>;
  findByEmail(email: string): Promise<AdminEntity | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResponse<AdminEntity>>;
  update(id: string, adminData: UpdateAdminRequest): Promise<AdminEntity | null>;
  delete(id: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<void>;
  findActiveAdmins(): Promise<AdminEntity[]>;
}
