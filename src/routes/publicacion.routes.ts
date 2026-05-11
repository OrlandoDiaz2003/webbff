import { Router } from "express";
import {
 getPublicationById,
 getAllPublicaciones,
 patchPublication,
 deletePublication,
 crearPublicacion
} from '../controllers/publicacion.controller'

const router = Router();

// GET /publicacion/{id}
router.get('/:id', getPublicationById);
router.get('', getAllPublicaciones);

// PATCH /publicacion/actualizar/{id}
router.patch('/actualizar/:id', patchPublication);

//DELETE /publicacion/eliminar/{id}
router.delete('/eliminar/:id', deletePublication);

//POST /publicacion/crear
router.post('/crear', crearPublicacion);
export default router;