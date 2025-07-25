import { RutProcessResultRepository } from './rutProcessResult.repository';
import { RutProcessResultModel } from '../rutProcessResult.schema';
import { RutProcessResultEntity, CreateRutProcessResultRequest, UpdateRutProcessResultRequest } from '../../domain/rutProcessResult.entity';
import { PaginationOptions, PaginatedResponse } from '../../../../shared/types/common.types';

export class RutProcessResultRepositoryImpl implements RutProcessResultRepository {
  public async create(resultData: CreateRutProcessResultRequest): Promise<RutProcessResultEntity> {
    const result = new RutProcessResultModel(resultData);
    const savedResult = await result.save();
    return this.toEntity(savedResult);
  }

  public async findById(id: string): Promise<RutProcessResultEntity | null> {
    const result = await RutProcessResultModel.findById(id);
    return result ? this.toEntity(result) : null;
  }

  public async findByRut(rut: string): Promise<RutProcessResultEntity[]> {
    const results = await RutProcessResultModel.find({ rut }).sort({ createdAt: -1 });
    return results.map(result => this.toEntity(result));
  }

  public async findByCreatedBy(createdBy: string, options: PaginationOptions): Promise<PaginatedResponse<RutProcessResultEntity>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    
    const [results, total] = await Promise.all([
      RutProcessResultModel.find({ createdBy })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      RutProcessResultModel.countDocuments({ createdBy })
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return {
      data: results.map(result => this.toEntity(result)),
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

  public async findAll(options: PaginationOptions): Promise<PaginatedResponse<RutProcessResultEntity>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    
    const [results, total] = await Promise.all([
      RutProcessResultModel.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      RutProcessResultModel.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return {
      data: results.map(result => this.toEntity(result)),
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

  public async update(id: string, resultData: UpdateRutProcessResultRequest): Promise<RutProcessResultEntity | null> {
    const result = await RutProcessResultModel.findByIdAndUpdate(
      id,
      resultData,
      { new: true, runValidators: true }
    );
    
    return result ? this.toEntity(result) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await RutProcessResultModel.findByIdAndDelete(id);
    return !!result;
  }

  public async findByRutAndCreatedBy(rut: string, createdBy: string): Promise<RutProcessResultEntity[]> {
    const results = await RutProcessResultModel.find({ rut, createdBy }).sort({ createdAt: -1 });
    return results.map(result => this.toEntity(result));
  }

  public async countByCreatedBy(createdBy: string): Promise<number> {
    return await RutProcessResultModel.countDocuments({ createdBy });
  }

  private toEntity(resultDoc: any): RutProcessResultEntity {
    return {
      _id: resultDoc._id.toString(),
      rut: resultDoc.rut,
      createdBy: resultDoc.createdBy,
      data: resultDoc.data,
      createdAt: resultDoc.createdAt,
      updatedAt: resultDoc.updatedAt
    };
  }
}
