import axios,{Axios, AxiosInstance} from "axios";
import dotenv from 'dotenv';

dotenv.config()

export interface PropiedadEntry {
  cantidadBaños: number;
  cantidadHabitaciones: number;
  ciudad: string;
  direccion: string;
  estado: string;
  fotosUrl: Array<string>;
  metraje: number;
  numeroUnidad: string;
  precio: number;
  propiedadId: number;
  tipo: string;
}

export interface PropiedadBuscarDTO {
  direccion?: string;
  cantidadHabitaciones?: number;
  ciudad?: string;
  precioMin?: number;
  precioMax?: number;
  metrajeMin?: number;
  metrajeMax?: number;
  tipoPropiedad?: number;
}

export interface PropiedadCrearDTO {
  direccion?: string;
  cantidadBaños?: number;
  cantidadHabitaciones?: number;
  metraje: number;
  precio: number;
  idVendedor: number;
  idCliente?: number;
  tipoPropiedad: number;
  idEstadoPropiedad: number;
  idCiudad: string;
  numeroUnidad?: string;
}

export interface PropiedadModificarDTO {
  cantidadHabitaciones: number;
  cantidadBaños: number;
  metraje: number;
  precio: number;
  estadoPropiedad: number;
  idCliente?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

class PropiedadService {
  private http: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = (process.env.PROPERTIES_SERVICE_URL || 'http://localhost:8085/api/v0/propiedad').replace(/\/$/, '');

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
    });

    this.http.interceptors.request.use(config => {
      const fullUrl = config.url?.startsWith('http')
        ? config.url
        : (config.baseURL?.replace(/\/$/, '') + (config.url || ''));

      console.log('DEBUG - Config BaseURL:', config.baseURL);
      console.log('DEBUG - Config URL:', config.url);
      console.log('Haciendo petición a:', fullUrl);
      return config;
    });
  }

  async getPropertyById(propertyId: string): Promise<PropiedadEntry> {
    try {
      const response = await this.http.get(`${this.baseUrl}/${propertyId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener propiedad');
    }
  }

  async search(query: PropiedadBuscarDTO, page: number = 0, size: number = 10): Promise<PageResponse<PropiedadEntry>> {
    try {
      const params = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      params.append('page', page.toString());
      params.append('size', size.toString());

      const queryString = params.toString();
      const finalUrl = `${this.baseUrl}${queryString ? `?${queryString}` : ''}`;

      const response = await this.http.get(finalUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al buscar propiedades');
    }
  }
  async crearPropiedad(propiedad: PropiedadCrearDTO): Promise<PropiedadEntry> {
    try {
      const response = await this.http.post('', propiedad);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear la propiedad');
    }
  }

  async actualizarPropiedad(propertyId: string, propiedad: PropiedadModificarDTO): Promise<PropiedadEntry> {
    try {
      const response = await this.http.patch(`${this.baseUrl}/${propertyId}`, propiedad);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la propiedad');
    }
  }

  async eliminarPropiedad(propertyId: string): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/${propertyId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la propiedad');
    }
  }
  }

export default new PropiedadService();