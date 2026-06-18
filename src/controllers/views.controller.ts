import { Request, Response } from 'express';
import viewsService from '../services/views.service';

export const getPublicacionesContenedores = async (req: Request, res: Response) => {
  try {
    const data = await viewsService.getPublicacionesParaContenedores();
    
    if (typeof data === 'string') {
      return res.status(200).send(data);
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener los contenedores de publicaciones' });
  }
};

export const getPublicacionDetalle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const data = await viewsService.getDetallePublicacion(id as string, token);
    
    if (typeof data === 'string') {
      return res.status(404).send(data);
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener el detalle de la publicación' });
  }
};

export const getAgendaHistorial = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.query;
    const token = req.headers.authorization;

    if (!userId || !role) {
      return res.status(400).json({ error: 'Se requiere userId y role (query params)' });
    }

    const data = await viewsService.getAgendaHistorial(userId as string, role as string, token);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
