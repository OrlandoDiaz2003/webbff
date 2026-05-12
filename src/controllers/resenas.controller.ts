import { Request, Response } from 'express';
import resenasService from '../services/resenas.service';

export const listarTodas = async (req: Request, res: Response) => {
  try {
    const resenas = await resenasService.listarTodas();
    res.json(resenas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const resena = await resenasService.obtenerPorId(id as string);
    res.json(resena);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const crearResena = async (req: Request, res: Response) => {
  try {
    const nuevaResena = await resenasService.crearResena(req.body);
    res.status(201).json(nuevaResena);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listarPorUsuario = async (req: Request, res: Response) => {
  const { usuarioId } = req.params;
  try {
    const resenas = await resenasService.listarPorUsuario(usuarioId as string);
    res.json(resenas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const listarPorPublicacion= async (req: Request, res: Response) => {
  const { publicacionId } = req.params;
  if (!publicacionId || publicacionId === "undefined" || isNaN(Number(publicacionId))) {
      return res.status(400).json({ 
        error: "ID de publicación no válido. Se recibió: " + publicacionId
      });
    }

  try {
    const resenas = await resenasService.listarPorPublicacion(publicacionId as string);

    res.json(resenas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarResena = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await resenasService.eliminarResena(id as string);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
