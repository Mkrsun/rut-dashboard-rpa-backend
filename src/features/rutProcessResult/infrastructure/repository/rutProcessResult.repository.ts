import { RutProcessResultEntity, CreateRutProcessResultRequest, UpdateRutProcessResultRequest } from '../../domain/rutProcessResult.entity';
import { PaginationOptions, PaginatedResponse } from '../../../../shared/types/common.types';

export interface RutProcessResultRepository {
  create(resultData: CreateRutProcessResultRequest): Promise<RutProcessResultEntity>;
  findById(id: string): Promise<RutProcessResultEntity | null>;
  findByRut(rut: string): Promise<RutProcessResultEntity[]>;
  findByCreatedBy(createdBy: string, options: PaginationOptions): Promise<PaginatedResponse<RutProcessResultEntity>>;
  findAll(options: PaginationOptions): Promise<PaginatedResponse<RutProcessResultEntity>>;
  update(id: string, resultData: UpdateRutProcessResultRequest): Promise<RutProcessResultEntity | null>;
  delete(id: string): Promise<boolean>;
  findByRutAndCreatedBy(rut: string, createdBy: string): Promise<RutProcessResultEntity[]>;
  countByCreatedBy(createdBy: string): Promise<number>;
}
