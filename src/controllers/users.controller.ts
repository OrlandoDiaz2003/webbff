import { Request, Response } from 'express';
import userService from '../services/user.service';

export const login = async (req: Request, res: Response) => {
  try {
    const response = await userService.login(req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const response = await userService.register(req.body);
    res.status(201).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  try {
    const user = await userService.getUserById(id as string, token);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  try {
    const response = await userService.updateUser(id as string, req.body, token);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  try {
    const response = await userService.deleteUser(id as string, token);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};