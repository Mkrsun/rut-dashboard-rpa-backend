import { 
  ProcessRutRequest, 
  ProcessRutResponse, 
  ProcessRutServiceInterface 
} from '../domain/processRut.entity';

export class ProcessRutUseCase {
  constructor(
    private readonly processRutService: ProcessRutServiceInterface
  ) {}

  public async processRut(request: ProcessRutRequest): Promise<ProcessRutResponse> {
    try {
      // Validate RUT format (basic validation)
      this.validateRut(request.rut);

      // Call external service
      const externalResult = await this.processRutService.request(request.rut);

      // Transform external response to our domain response
      const response: ProcessRutResponse = {
        success: externalResult.success,
        rut: request.rut,
        data: externalResult.data,
        message: externalResult.message || (externalResult.success ? 'RUT processed successfully' : 'Failed to process RUT'),
        processedAt: new Date()
      };

      // If the external service failed, include error information
      if (!externalResult.success && externalResult.error) {
        response.message = `${response.message}: ${externalResult.error}`;
      }

      return response;
    } catch (error) {
      console.error('Error in ProcessRutUseCase:', error);
      
      return {
        success: false,
        rut: request.rut,
        message: error instanceof Error ? error.message : 'Internal error processing RUT',
        processedAt: new Date()
      };
    }
  }

  private validateRut(rut: string): void {
    if (!rut || typeof rut !== 'string') {
      throw new Error('RUT is required and must be a string');
    }

    // Remove any formatting characters
    const cleanRut = rut.replace(/[.-]/g, '');
    
    if (cleanRut.length < 8 || cleanRut.length > 9) {
      throw new Error('RUT must have between 8 and 9 characters');
    }

    // Basic format validation (digits and optionally one letter at the end)
    const rutPattern = /^\d{7,8}[0-9Kk]$/;
    if (!rutPattern.test(cleanRut)) {
      throw new Error('Invalid RUT format');
    }
  }
}
