import bcrypt from 'bcryptjs';
import { AdminRepository } from '../infrastructure/repository/admin.repository';
import { 
  AdminEntity, 
  CreateAdminRequest, 
  UpdateAdminRequest, 
  LoginRequest, 
  LoginResponse,
  AdminResponse 
} from '../domain/admin.entity';
import { PaginationOptions, PaginatedResponse } from '../../../shared/types/common.types';
import { JwtUtil } from '../../../shared/utils/jwt.util';

export class AdminUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  public async createAdmin(adminData: CreateAdminRequest): Promise<AdminResponse> {
    // Check if email already exists
    const existingAdmin = await this.adminRepository.findByEmail(adminData.email);
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const admin = await this.adminRepository.create(adminData);
    return this.toResponse(admin);
  }

  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    const admin = await this.adminRepository.findByEmail(credentials.email);
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await this.adminRepository.updateLastLogin(admin._id);

    const token = JwtUtil.generateToken({
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

    return {
      admin: this.toResponse(admin),
      token
    };
  }

  public async getAdminById(id: string): Promise<AdminResponse | null> {
    const admin = await this.adminRepository.findById(id);
    return admin ? this.toResponse(admin) : null;
  }

  public async getAllAdmins(options: PaginationOptions): Promise<PaginatedResponse<AdminResponse>> {
    const result = await this.adminRepository.findAll(options);
    return {
      ...result,
      data: result.data.map(admin => this.toResponse(admin))
    };
  }

  public async updateAdmin(id: string, adminData: UpdateAdminRequest): Promise<AdminResponse | null> {
    // Check if email is being updated and if it already exists
    if (adminData.email) {
      const existingAdmin = await this.adminRepository.findByEmail(adminData.email);
      if (existingAdmin && existingAdmin._id !== id) {
        throw new Error('Admin with this email already exists');
      }
    }

    const admin = await this.adminRepository.update(id, adminData);
    return admin ? this.toResponse(admin) : null;
  }

  public async deleteAdmin(id: string): Promise<boolean> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    return await this.adminRepository.delete(id);
  }

  public async getActiveAdmins(): Promise<AdminResponse[]> {
    const admins = await this.adminRepository.findActiveAdmins();
    return admins.map(admin => this.toResponse(admin));
  }

  public async changePassword(id: string, newPassword: string): Promise<AdminResponse | null> {
    const admin = await this.adminRepository.update(id, { password: newPassword });
    return admin ? this.toResponse(admin) : null;
  }

  public async toggleAdminStatus(id: string): Promise<AdminResponse | null> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const updatedAdmin = await this.adminRepository.update(id, { isActive: !admin.isActive });
    return updatedAdmin ? this.toResponse(updatedAdmin) : null;
  }

  private toResponse(admin: AdminEntity): AdminResponse {
    // Remove password from response
    const { password, ...adminResponse } = admin;
    return adminResponse;
  }
}
