import { Response } from 'express';
import { RutProcessResultControllerInterface } from './rutProcessResult.controller.interface';
import { RutProcessResultUseCase } from '../../application/rutProcessResult.usecase';
import { ResponseUtil } from '../../../../shared/utils/response.util';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { CreateRutProcessResultRequest, UpdateRutProcessResultRequest } from '../../domain/rutProcessResult.entity';

export class RutProcessResultController implements RutProcessResultControllerInterface {
  constructor(private readonly rutProcessResultUseCase: RutProcessResultUseCase) {}

  public async createResult(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { rut, data }: CreateRutProcessResultRequest = req.body;
      const createdBy = req.user?._id;

      if (!rut) {
        ResponseUtil.badRequest(res, 'RUT is required');
        return;
      }

      if (!createdBy) {
        ResponseUtil.unauthorized(res, 'User not authenticated');
        return;
      }

      const result = await this.rutProcessResultUseCase.createResult({
        rut,
        createdBy,
        data
      });

      ResponseUtil.created(res, result, 'RUT Process Result created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create result';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getResultById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.badRequest(res, 'Result ID is required');
        return;
      }

      const result = await this.rutProcessResultUseCase.getResultById(id);
      if (!result) {
        ResponseUtil.notFound(res, 'Result not found');
        return;
      }

      ResponseUtil.success(res, result, 'Result retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get result';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getAllResults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await this.rutProcessResultUseCase.getAllResults({
        page,
        limit,
        sortBy,
        sortOrder
      });

      ResponseUtil.success(res, result, 'Results retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get results';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getResultsByRut(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { rut } = req.params;

      if (!rut) {
        ResponseUtil.badRequest(res, 'RUT is required');
        return;
      }

      const results = await this.rutProcessResultUseCase.getResultsByRut(rut);
      ResponseUtil.success(res, results, 'Results retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get results by RUT';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getMyResults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const createdBy = req.user?._id;
      if (!createdBy) {
        ResponseUtil.unauthorized(res, 'User not authenticated');
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await this.rutProcessResultUseCase.getResultsByCreatedBy(createdBy, {
        page,
        limit,
        sortBy,
        sortOrder
      });

      ResponseUtil.success(res, result, 'Your results retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get your results';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async updateResult(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateRutProcessResultRequest = req.body;

      if (!id) {
        ResponseUtil.badRequest(res, 'Result ID is required');
        return;
      }

      const result = await this.rutProcessResultUseCase.updateResult(id, updateData);
      if (!result) {
        ResponseUtil.notFound(res, 'Result not found');
        return;
      }

      ResponseUtil.success(res, result, 'Result updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update result';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async deleteResult(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.badRequest(res, 'Result ID is required');
        return;
      }

      const deleted = await this.rutProcessResultUseCase.deleteResult(id);
      if (!deleted) {
        ResponseUtil.notFound(res, 'Result not found');
        return;
      }

      ResponseUtil.success(res, null, 'Result deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete result';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async searchResults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { q: searchTerm } = req.query;
      const createdBy = req.query.createdBy as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!searchTerm || typeof searchTerm !== 'string') {
        ResponseUtil.badRequest(res, 'Search term is required');
        return;
      }

      const result = await this.rutProcessResultUseCase.searchResults(
        searchTerm,
        createdBy,
        { page, limit }
      );

      ResponseUtil.success(res, result, 'Search results retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search results';
      ResponseUtil.error(res, errorMessage);
    }
  }

  public async getResultStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const createdBy = req.user?._id;
      if (!createdBy) {
        ResponseUtil.unauthorized(res, 'User not authenticated');
        return;
      }

      const count = await this.rutProcessResultUseCase.getResultCountByCreatedBy(createdBy);
      
      const stats = {
        totalResults: count,
        createdBy
      };

      ResponseUtil.success(res, stats, 'Result statistics retrieved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get result statistics';
      ResponseUtil.error(res, errorMessage);
    }
  }
}
