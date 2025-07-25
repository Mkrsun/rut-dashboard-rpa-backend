export interface ProcessRutRequest {
  rut: string;
}

export interface ProcessRutResponse {
  success: boolean;
  rut: string;
  data?: any;
  message?: string;
  processedAt: Date;
}

export interface ExternalProcessRutRequest {
  rut: string;
}

export interface ExternalProcessRutResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export interface ProcessRutServiceInterface {
  request(rut: string): Promise<ExternalProcessRutResponse>;
}
