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
