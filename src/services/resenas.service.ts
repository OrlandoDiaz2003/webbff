import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface Resena {
  id: number;
  usuarioId: number;
}

export interface ResenaCrearDTO {
  comentario: string;
  clasificacion: number;
  fecha: string;
  publicacionId: number;
  usuarioId: number;
}

class ResenasService {
  private http: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = (process.env.RESENAS_SERVICE_URL || 'http://api-gateway:8085/api/v1/resenas').replace(/\/$/, '');


    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  async listarTodas(): Promise<Resena[]> {
    try {
      const response = await this.http.get('/all');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las reseñas');
    }
  }

  async obtenerPorId(id: string): Promise<Resena> {
    try {
      const response = await this.http.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener la reseña');
    }
  }

  async crearResena(dto: ResenaCrearDTO): Promise<Resena> {
    try {
      const response = await this.http.post('/crear', dto);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear la reseña');
    }
  }

  async listarPorUsuario(usuarioId: string): Promise<Resena[]> {
    try {
      const response = await this.http.get(`/usuario/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las reseñas del usuario');
    }
  }

  async listarPorPublicacion(publicacionId: String): Promise<Resena[]> {
    try {
      const response = await this.http.get(`/publicacionId/${publicacionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las reseñas en la publicacion');
    }
  }

  async eliminarResena(id: string): Promise<void> {
    try {
      await this.http.delete(`/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la reseña');
    }
  }
}

export default new ResenasService();
