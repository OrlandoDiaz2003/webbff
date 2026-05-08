import { Router } from 'express';
import {
  login,
  register,
  getUserById,
  updateUser,
  deleteUser 
} from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /users/login
router.post('/login', login);

// POST /users/register
router.post('/register', register);

// GET /users/{id} (Requiere autenticación)
router.get('/:id', authMiddleware, getUserById);

// PUT /users/{id} (Requiere autenticación)
router.put('/:id', authMiddleware, updateUser);

// DELETE /users/{id} (Requiere autenticación)
router.delete('/:id', authMiddleware, deleteUser);

export default router;
