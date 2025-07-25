import { 
  ProcessRutServiceInterface, 
  ExternalProcessRutRequest, 
  ExternalProcessRutResponse 
} from '../../domain/processRut.entity';
import { EnvironmentConfig } from '../../../../shared/config/environment.config';

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Add authorization header if token is available
      if (this.apiToken) {
        headers['Authorization'] = `Bearer ${this.apiToken}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - External service did not respond in time');
      }
      
      throw error;
    }
  }
}
