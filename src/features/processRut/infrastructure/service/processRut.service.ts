import { 
  ProcessRutServiceInterface, 
  ExternalProcessRutRequest, 
  ExternalProcessRutResponse 
} from '../../domain/processRut.entity';
import { EnvironmentConfig } from '../../../../shared/config/environment.config';
import axios from 'axios';

export class ProcessRutService implements ProcessRutServiceInterface {
  private readonly externalApiUrl: string;
  private readonly timeout: number;
  private readonly apiToken: string;

  constructor() {
    this.externalApiUrl = EnvironmentConfig.EXTERNAL_RUT_PROCESS_API_URL;
    this.timeout = EnvironmentConfig.EXTERNAL_API_TIMEOUT;
    this.apiToken = EnvironmentConfig.EXTERNAL_API_TOKEN;
  }

  public async request(rut: string): Promise<ExternalProcessRutResponse> {
    try {
      const requestData: ExternalProcessRutRequest = { rut };

      console.log(`[ProcessRutService] Making request to: ${this.externalApiUrl}`);
      console.log(`[ProcessRutService] Request data:`, requestData);

      const response = await this.makeHttpRequest(this.externalApiUrl, requestData);
      
      return {
        success: true,
        data: response.data,
        message: response.message || 'RUT processed successfully'
      };
    } catch (error) {
      console.error('Error processing RUT in external service:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to process RUT'
      };
    }
  }

  private async makeHttpRequest(url: string, data: ExternalProcessRutRequest): Promise<any> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Add authorization header if token is available
      if (this.apiToken) {
        headers['Authorization'] = `Bearer ${this.apiToken}`;
      }

      const response = await axios({
        method: 'POST',
        url: url,
        data: data,
        headers: headers,
        timeout: this.timeout,
        validateStatus: (status) => status < 500 // Accept all status codes below 500
      });

      console.log(`[ProcessRutService] Response status: ${response.status}`);
      console.log(`[ProcessRutService] Response data:`, response.data);

      if (response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - External service did not respond in time');
      }
      
      if (error.response) {
        throw new Error(`HTTP error! status: ${error.response.status} - ${error.response.statusText}`);
      }
      
      if (error.request) {
        throw new Error('No response received from external service');
      }
      
      throw error;
    }
  }
}
