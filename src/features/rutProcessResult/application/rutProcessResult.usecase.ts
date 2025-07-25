import { RutProcessResultRepository } from '../infrastructure/repository/rutProcessResult.repository';
import { 
  RutProcessResultEntity, 
  CreateRutProcessResultRequest, 
  UpdateRutProcessResultRequest,
  RutProcessResultResponse 
} from '../domain/rutProcessResult.entity';
import { PaginationOptions, PaginatedResponse } from '../../../shared/types/common.types';

export class RutProcessResultUseCase {
  constructor(private readonly rutProcessResultRepository: RutProcessResultRepository) {}

  public async createResult(resultData: CreateRutProcessResultRequest): Promise<RutProcessResultResponse> {
    const result = await this.rutProcessResultRepository.create(resultData);
    return this.toResponse(result);
  }

  public async getResultById(id: string): Promise<RutProcessResultResponse | null> {
    const result = await this.rutProcessResultRepository.findById(id);
    return result ? this.toResponse(result) : null;
  }

  public async getAllResults(options: PaginationOptions): Promise<PaginatedResponse<RutProcessResultResponse>> {
    const result = await this.rutProcessResultRepository.findAll(options);
    return {
      ...result,
      data: result.data.map(item => this.toResponse(item))
    };
  }

  public async getResultsByRut(rut: string): Promise<RutProcessResultResponse[]> {
    const results = await this.rutProcessResultRepository.findByRut(rut);
    return results.map(result => this.toResponse(result));
  }

  public async getResultsByCreatedBy(createdBy: string, options: PaginationOptions): Promise<PaginatedResponse<RutProcessResultResponse>> {
    const result = await this.rutProcessResultRepository.findByCreatedBy(createdBy, options);
    return {
      ...result,
      data: result.data.map(item => this.toResponse(item))
    };
  }

  public async getResultsByRutAndCreatedBy(rut: string, createdBy: string): Promise<RutProcessResultResponse[]> {
    const results = await this.rutProcessResultRepository.findByRutAndCreatedBy(rut, createdBy);
    return results.map(result => this.toResponse(result));
  }

  public async updateResult(id: string, resultData: UpdateRutProcessResultRequest): Promise<RutProcessResultResponse | null> {
    const result = await this.rutProcessResultRepository.update(id, resultData);
    return result ? this.toResponse(result) : null;
  }

  public async deleteResult(id: string): Promise<boolean> {
    const result = await this.rutProcessResultRepository.findById(id);
    if (!result) {
      throw new Error('RUT Process Result not found');
    }

    return await this.rutProcessResultRepository.delete(id);
  }

  public async getResultCountByCreatedBy(createdBy: string): Promise<number> {
    return await this.rutProcessResultRepository.countByCreatedBy(createdBy);
  }

  public async searchResults(
    searchTerm: string, 
    createdBy?: string, 
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<RutProcessResultResponse>> {
    // For now, we'll search by RUT. In the future, this could be expanded
    // to search through the flexible data structure as well
    const results = await this.rutProcessResultRepository.findByRut(searchTerm);
    
    // Filter by createdBy if provided
    const filteredResults = createdBy 
      ? results.filter(result => result.createdBy === createdBy)
      : results;

    // Manual pagination for search results
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const paginatedData = filteredResults.slice(skip, skip + limit);
    const total = filteredResults.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedData.map(result => this.toResponse(result)),
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

  private toResponse(result: RutProcessResultEntity): RutProcessResultResponse {
    return {
      _id: result._id,
      rut: result.rut,
      createdBy: result.createdBy,
      data: result.data,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
  }
}
