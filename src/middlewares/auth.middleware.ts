import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_de_32_caracteres_aqui';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const secretBuffer = Buffer.from(JWT_SECRET, 'base64');
    const decoded = jwt.verify(token, secretBuffer);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
