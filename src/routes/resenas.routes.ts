import { Router } from 'express';
import {
  listarTodas,
  obtenerPorId,
  crearResena,
  listarPorUsuario,
  eliminarResena
} from '../controllers/resenas.controller';

const router = Router();

router.get('/all', listarTodas);
router.get('/:id', obtenerPorId);
router.post('/crear', crearResena);
router.get('/usuario/:usuarioId', listarPorUsuario);
router.delete('/:id', eliminarResena);

export default router;
