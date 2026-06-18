import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface AgendaEntry {
  id?: number;
  idAgenda?: number;
  IdAgenda?: number;
  estadoCita: string;
  fecha: string;
  idCliente: string;
  idVendedor: string;
  idPublicacion: number;
  clienteMensaje: string;
  vendedorMensaje?: string;
}

export interface AgendaCrearDTO {
  idPublicacion: number;
  idVendedor: number;
  fecha: string;
  idEstadoCita: number;
  idCliente?: number;
  clienteMensaje: string;
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

  private normalize(item: any): AgendaEntry {
    return {
      ...item,
      idAgenda: item.idAgenda || item.IdAgenda || item.id
    };
  }

  async getByCliente(clienteId: string): Promise<AgendaEntry[]> {
    try {
      const response = await this.http.get(`cliente/${clienteId}`);
      return (response.data as any[]).map(item => this.normalize(item));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener agenda por cliente');
    }
  }

  async getByVendedor(vendedorId: string): Promise<AgendaEntry[]> {
    try {
      const response = await this.http.get(`vendedor/${vendedorId}`);
      return (response.data as any[]).map(item => this.normalize(item));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener agenda por vendedor');
    }
  }

  async create(entry: AgendaCrearDTO): Promise<AgendaEntry> {
    try {
      const response = await this.http.post('', entry);
      return this.normalize(response.data);
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

  async cambiarEstado(id: number, estado: string, respuesta?: string): Promise<any> {
    try {
      const response = await this.http.put(`/${id}/estado`, null, {
        params: { estado, respuesta }
      });
      return response.data;
    } catch (error: any) {
      console.error('AGENDA ERROR - Detalle:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al cambiar el estado de la cita');
    }
  }

  async getPublicacionesPendientes(clienteId: string): Promise<number[]> {
    try {
      const response = await this.http.get(`/cliente/${clienteId}/publicaciones-pendientes`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener publicaciones pendientes');
    }
  }
}

export default new AgendaService();
