import { Request, Response } from "express";
import publicacionService from "../services/Publicacion.service";

export const getAllPublicaciones = async (req: Request, res: Response) => {

};

export const getPublicationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const publicacion = await publicacionService.getPublicacionByid(
      id as string,
    );
    res.json(publicacion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const crearPublicacion = async (req: Request, res: Response) => {
  try {
    const property = await publicacionService.crearPublicacion(req.body);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};


export const patchPublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const publicacion = await publicacionService.updatePublicacion(id as string, req.body);
    res.json(publicacion);
  } catch (error:any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const deletePublication = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await publicacionService.deletePublicacion(id as string);
    res.json({ message: `publicacion eliminada` });
  } catch(error:any){
      throw new Error(error.response?.data?.message || 'Error al eliminar publicacion');
  }
}
