import axios from "axios";
import axiosm, {AxiosInstance} from "axios";
import dotenv from 'dotenv'

dotenv.config();

export interface PaymentsEntry {
  idTransferencia: number;
  estado: string;
  mensaje: string;
  fecha: string;
}

export interface PaymentsRequest {
  idUsuario: number;
  idPublicacion: number;
  monto: number;
  numeroTarjeta: string;
  nombreTitular: string;
  fechaExpiracion: string;
  cvv: string;
}

class PaymentsService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:8085/payments',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  async pay(request: PaymentRequest): Promise<PaymentsEntry>{
    try {
      const response = await this.http.post('',request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error procesando el pago");
    }
  }

  async getPaymentById(id: string): Promise<PaymentsEntry>{
    try {
      const response = await this.http.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "error al obtener pago");
    }
  }
}
export default new PaymentsService;