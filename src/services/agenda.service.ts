import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface AgendaEntry {
  estadoCita: String;
  fecha: string;
  idCliente: string;
  idVendedor: string;
  idPropiedad: number;
}

export interface AgendaCrearDTO {
  propiedadId: number;
  idVendedor: number;
  fecha: String;
  idEstadoCita: number;
  idCliente?: number;
}

class AgendaService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: process.env.AGENDA_SERVICE_URL || 'http://localhost:8085/api/v0/agenda/',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.http.interceptors.request.use(config => {
      console.log('AGENDA DEBUG - Haciendo petición a:', (config.baseURL || '') + (config.url || ''));
      console.log('AGENDA DEBUG - Body:', config.data);
      return config;
    });
  }

  async getByCliente(clienteId: string): Promise<AgendaEntry[]> {
    try {
      const response = await this.http.get(`cliente/${clienteId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener agenda por cliente');
    }
  }

  async getByVendedor(vendedorId: string): Promise<AgendaEntry[]> {
    try {
      const response = await this.http.get(`vendedor/${vendedorId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener agenda por vendedor');
    }
  }

  async create(entry: AgendaCrearDTO): Promise<AgendaEntry> {
    try {
      const response = await this.http.post('', entry);
      return response.data;
    } catch (error: any) {
      console.error('AGENDA ERROR - Detalle:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear entrada en la agenda');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await this.http.delete(`/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar entrada de la agenda');
    }
  }
}

export default new AgendaService();
