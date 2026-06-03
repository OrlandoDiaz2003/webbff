import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { PageResponse } from './propiedad.service';

dotenv.config();

export interface PublicacionModificarDTO {
    titulo: String;
    descripcion: String;
    precio: Number;
    Estado: String;
}

export interface PublicacionRequestDTO {
    titulo: String;
    descripcion: String;
    precio: Number;
    ubicacion: String;
    vendedorId: number;
    propiedadId: number;
}

export interface PublicacionModificarDTO {
    titulo: String;
    descripcion: String;
    precio: Number;
    ubicacion: String;
    vendedorId: number;
    propiedadId: number;
}

export interface Publicacion {
    idpublicacion: number;
    titulo: String;
    descripcion: String;
    precio: Number;
    ubicacion: String;
    vendedorId: number;
    propiedadId: number;
    estado: string;
    fechaPublicacion: string;
}

class PublicacionService {
    private http: AxiosInstance;
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = (
            process.env.PUBLICACION_SERVICE_URL ||
            "http://localhost:8085/api/v1/publicacion"
        ).replace(/\/$/, "");

        this.http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.http.interceptors.request.use((config) => {
            const fullUrl = config.url?.startsWith("http")
                ? config.url
                : config.baseURL?.replace(/\/$/, "") + (config.url || "");

            console.log("DEBUG - Config BaseURL:", config.baseURL);
            console.log("DEBUG - Config URL:", config.url);
            console.log("Haciendo petición a:", fullUrl);
            return config;
        });
    }

    async getPublicacionAll(): Promise<Publicacion[]> {
        try {
            const response = await this.http.get('/all');
            console.log('DEBUG - Publicaciones recibidas:', response.data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Error al obtener publicaciones del microservicio",
            );
        }
    }

    async getPublicacionByid(publicacionId: string): Promise<Publicacion> {
        try {
            const response = await this.http.get(`${this.baseUrl}/${publicacionId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Error al obtener publicacion",
            );
        }
    }

    async crearPublicacion(publicacion: PublicacionRequestDTO): Promise<Publicacion> {
        try {
            const response = await this.http.post(`${this.baseUrl}/crear`, publicacion);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al crear la publicacion');
        }
    }

    async updatePublicacion(
        publicacionId: string,
        publicacionModificar: PublicacionModificarDTO,
    ): Promise<Publicacion> {
        try {
            const response = await this.http.patch(
                `${this.baseUrl}/actualizar/${publicacionId}`,
                publicacionModificar,
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Error al modificar publicacion",
            );
        }
    }

    async deletePublicacion(publicacionId: string): Promise<void> {
        try {
            await this.http.delete(`${this.baseUrl}/eliminar/${publicacionId}`);
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Error al eliminar publicacion",
            );
        }
    }
}

export default new PublicacionService();
