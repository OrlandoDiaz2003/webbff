import { Router } from 'express';
import {
  listarTodas,
  obtenerPorId,
  crearResena,
  listarPorUsuario,
  eliminarResena,
  listarPorPublicacion
} from '../controllers/resenas.controller';

const router = Router();

router.get('/all', listarTodas);
router.get('/:id', obtenerPorId);
router.get('/publicacionId/:publicacionId', listarPorPublicacion);
router.post('/crear', crearResena);
router.get('/usuario/:usuarioId', listarPorUsuario);
router.delete('/:id', eliminarResena);

export default router;
