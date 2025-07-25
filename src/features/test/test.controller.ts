import { Request, Response } from 'express';
import { ResponseUtil } from '../../shared/utils/response.util';

export interface TestProcessRutRequest {
  rut: string;
}

export class TestController {
  
  /**
   * Simula el servicio externo de procesamiento de RUT
   * Endpoint temporal para testing: POST /api/v1/test/process-rut
   */
  public async simulateExternalProcessRut(
    req: Request<{}, {}, TestProcessRutRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { rut } = req.body;

      console.log(`[TEST ENDPOINT] Simulating external RUT processing for: ${rut}`);

      // Simular un pequeño delay como si fuera un servicio externo real
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular respuesta exitosa del servicio externo
      const mockExternalResponse = {
        success: true,
        data: {
          rut: rut,
          processedData: {
            status: 'processed',
            timestamp: new Date().toISOString(),
            details: {
              validation: 'passed',
              score: Math.floor(Math.random() * 100) + 1,
              category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
            }
          }
        },
        message: 'RUT processed successfully by external service'
      };

      ResponseUtil.success(res, mockExternalResponse, 'External service simulation completed');
    } catch (error) {
      console.error('Error in test endpoint:', error);
      ResponseUtil.error(
        res,
        error instanceof Error ? error.message : 'Test endpoint error',
        500
      );
    }
  }
}
