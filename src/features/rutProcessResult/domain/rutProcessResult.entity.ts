import { BaseEntity } from '../../../shared/types/common.types';

export interface RutProcessResultEntity extends BaseEntity {
  rut: string;
  createdBy: string; // adminId
  data?: any; // Flexible data structure for any additional attributes
}

export interface CreateRutProcessResultRequest {
  rut: string;
  createdBy: string;
  data?: any;
}

export interface UpdateRutProcessResultRequest {
  rut?: string;
  data?: any;
}

export interface RutProcessResultResponse extends RutProcessResultEntity {}
