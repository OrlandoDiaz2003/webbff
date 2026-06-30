import { Request, Response } from 'express';
import propiedadService from '../services/propiedad.service';

export const getPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await propiedadService.getPropertyById(id as string);
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const listProperties = async (req: Request, res: Response) => {
  try {
    const { page, size, ...filters } = req.query;
    const result = await propiedadService.search(
      filters as any,
      Number(page) || 0,
      Number(size) || 10
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await propiedadService.crearPropiedad(req.body);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const patchProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await propiedadService.actualizarPropiedad(id as string, req.body);
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await propiedadService.eliminarPropiedad(id as string);
    res.json({ message: `Property deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getPropertiesByCityId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const propertyIds = await propiedadService.getPropertiesByCityId(id as string);
    res.json(propertyIds);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
