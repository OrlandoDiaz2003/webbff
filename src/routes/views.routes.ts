import { Router } from 'express';
import { 
  getPublicacionesContenedores, 
  getPublicacionDetalle 
} from '../controllers/views.controller';

const router = Router();

// GET /api/v1/views/publicaciones-containers
router.get('/publicaciones-containers', getPublicacionesContenedores);

// GET /api/v1/views/publicacion-detalle/:id
router.get('/publicacion-detalle/:id', getPublicacionDetalle);

export default router;
