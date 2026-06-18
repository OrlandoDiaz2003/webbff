import { Request, Response } from 'express';
import agendaService from '../services/agenda.service';

export const getAgendaByCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const agenda = await agendaService.getByCliente(id as string);
    res.json(agenda);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAgendaByVendedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const agenda = await agendaService.getByVendedor(id as string);
    res.json(agenda);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAgendaEntry = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await agendaService.delete(id as string);
    res.json({ message: `Agenda entry ${id} deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAgendaEntry = async (req: Request, res: Response) => {
  try {
    const newEntry = await agendaService.create(req.body);
    res.status(201).json(newEntry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstado = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Obtener de body o query para mayor flexibilidad
  const estadoRaw = req.body?.estado || req.query.estado;
  const respuesta = req.body?.respuesta || req.query.respuesta;

  if (!estadoRaw) {
    return res.status(400).json({ error: 'El campo "estado" es obligatorio.' });
  }

  // Convertir a minúsculas para que 'ACEPTADA' sea válida
  const estado = (estadoRaw as string).toLowerCase();
  const estadosValidos = ['completada', 'pendiente', 'aceptada', 'cancelada'];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado "${estadoRaw}" no válido. Permitidos: ${estadosValidos.join(', ')}` });
  }

  try {
    const response = await agendaService.cambiarEstado(Number(id), estado, respuesta as string);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicacionesPendientes = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ids = await agendaService.getPublicacionesPendientes(id as string);
    res.json(ids);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
