import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://back.apisunat.com/api';
const URL_APISUNAT = 'https://apisunat.com/api';

@Injectable()
export class ApisPeruClient {
  private readonly logger = new Logger(ApisPeruClient.name);
  public client: AxiosInstance;
  public accessToken?: string;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const resp = await axios.post<{
        username: string;
        email: string;
        avatar: string;
        fullname: string;
        phone: string;
        id: string;
        accessToken: string;
      }>(`${URL_APISUNAT}/users/login`, {
        email,
        password,
      });

      this.logger.debug('RESPUESTA DE APISUNAT LOGIN');
      this.accessToken = resp.data.accessToken;
    } catch (err: any) {
      this.logger.error(
        'Error al autenticar en APISUNAT:',
        err.response?.data || err.message,
      );
      throw new Error('Error al autenticar en APISUNAT');
    }
  }

  async createCompany(payload: {
    RUC: string;
    name: string;
    address: string;
    tradename: string;
  }): Promise<{
    ruc: string;
    address: string;
    name: string;
    tradename: string;
  }> {
    if (!this.accessToken) {
      throw new Error('Debe autenticarse primero con login()');
    }

    const url = `/personas?access_token=${this.accessToken}`;

    try {
      const resp = await this.client.post<{
        ruc: string;
        address: string;
        name: string;
        tradename: string;
      }>(url, payload);

      this.logger.debug('RESPUESTA DE APISUNAT CREATE COMPANY');
      return resp.data;
    } catch (err: any) {
      this.logger.error(
        'Error al crear empresa en APISUNAT:',
        err.response?.data || err.message,
      );
      throw new Error('Error al crear empresa en APISUNAT');
    }
  }

  async listCompanies(): Promise<any[]> {
    if (!this.accessToken) {
      throw new Error('Debe autenticarse primero con login()');
    }
    const resp = await this.client.get<{ data: any[] }>('/companies');
    return resp.data.data;
  }
}
