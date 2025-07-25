import bcrypt from 'bcryptjs';
import { AdminRepository } from './admin.repository';
import { AdminModel } from '../admin.schema';
import { AdminEntity, CreateAdminRequest, UpdateAdminRequest } from '../../domain/admin.entity';
import { PaginationOptions, PaginatedResponse } from '../../../../shared/types/common.types';

export class AdminRepositoryImpl implements AdminRepository {
  public async create(adminData: CreateAdminRequest): Promise<AdminEntity> {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    
    const admin = new AdminModel({
      ...adminData,
      password: hashedPassword
    });
    
    const savedAdmin = await admin.save();
    return this.toEntity(savedAdmin);
  }

  public async findById(id: string): Promise<AdminEntity | null> {
    const admin = await AdminModel.findById(id);
    return admin ? this.toEntity(admin) : null;
  }

  public async findByEmail(email: string): Promise<AdminEntity | null> {
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    return admin ? this.toEntity(admin) : null;
  }

  public async findAll(options: PaginationOptions): Promise<PaginatedResponse<AdminEntity>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    
    const [admins, total] = await Promise.all([
      AdminModel.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      AdminModel.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return {
      data: admins.map(admin => this.toEntity(admin)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  public async update(id: string, adminData: UpdateAdminRequest): Promise<AdminEntity | null> {
    const updateData: any = { ...adminData };
    
    // Hash password if provided
    if (adminData.password) {
      updateData.password = await bcrypt.hash(adminData.password, 12);
    }
    
    const admin = await AdminModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return admin ? this.toEntity(admin) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await AdminModel.findByIdAndDelete(id);
    return !!result;
  }

  public async updateLastLogin(id: string): Promise<void> {
    await AdminModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  public async findActiveAdmins(): Promise<AdminEntity[]> {
    const admins = await AdminModel.find({ isActive: true });
    return admins.map(admin => this.toEntity(admin));
  }

  private toEntity(adminDoc: any): AdminEntity {
    return {
      _id: adminDoc._id.toString(),
      name: adminDoc.name,
      email: adminDoc.email,
      password: adminDoc.password,
      role: adminDoc.role,
      isActive: adminDoc.isActive,
      lastLogin: adminDoc.lastLogin,
      createdAt: adminDoc.createdAt,
      updatedAt: adminDoc.updatedAt
    };
  }
}
