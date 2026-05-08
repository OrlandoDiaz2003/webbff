import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  id_rol: number;
  id_termino: number;
}


export interface User {
usuario: {
    idUsuario: number;
    nombre: string;
    email: string;
    password: string;
    rol: {
      idRol: number;
      nombre: String;
    },
  }
}

export interface RegisterResponse {
  message: string;
  usuario: User;
}
export interface AuthReponse {
  message: string;
  token: string;
  user: User;
}


class UserService {
  private http: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = (process.env.USERS_SERVICE_URL || 'http://localhost:8085/users').replace(/\/$/, '');

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
    });

    // Interceptor para debugging
    this.http.interceptors.request.use(config => {
      const fullUrl = (config.baseURL || '') + (config.url || '');
      console.log('USER DEBUG - Haciendo petición a:', fullUrl);
      console.log('USER DEBUG - Body:', config.data);
      return config;
    });
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.http.post('/register', request);
      return response.data;
    } catch(error: any) {
      console.error('USER ERROR - Detalle Registro:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  }

  async login(request: LoginRequest): Promise<AuthReponse> {
    try {
      const response = await this.http.post('/login', request);
      return response.data;
    } catch(error: any) {
      console.error('USER ERROR - Detalle Login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al logearse');
    }
  }

  async getUserById(id: string, token?: string): Promise<User> {
    try {
      const response = await this.http.get(`/${id}`, {
        headers: token ? { Authorization: token } : {}
      });
      return response.data;
    } catch (error: any) {
      console.error('USER ERROR - Detalle GetUser:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener datos del usuario');
    }
  }

  async updateUser(id: string, user: LoginRequest, token?: string): Promise<void>  {
    try {
      const reponse = await this.http.put(`/${id}`, user, {
        headers: token ? { Authorization: token } : {}
      });
      return reponse.data;
    }catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
    }
  }

  async deleteUser(id: string, token?: string) : Promise<string> {
    try {
      const reponse = await this.http.delete(`/${id}`, {
        headers: token ? {Authorization: token} : {}
      });
      return reponse.data;
    }catch (error:any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario')
    }
  }
}

export default new UserService();