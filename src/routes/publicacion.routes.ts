import { Router } from "express";
import {
 getPublicationById,
 getAllPublicaciones,
 patchPublication,
 deletePublication,
 crearPublicacion,
 crearPublicacionCompleta,
 eliminarPublicacionCompleta
} from '../controllers/publicacion.controller'

const router = Router();

// GET /publicacion/{id}
router.get('/:id', getPublicationById);
router.get('', getAllPublicaciones);

// PATCH /publicacion/actualizar/{id}
router.patch('/actualizar/:id', patchPublication);

//DELETE /publicacion/eliminar/{id}
router.delete('/eliminar/:id', deletePublication);

//DELETE /publicacion/eliminar-cascada/{id} (Orquestador)
router.delete('/eliminar-cascada/:id', eliminarPublicacionCompleta);

//POST /publicacion/crear-completa (Orquestador)
router.post('/crear-completa', crearPublicacionCompleta);

//POST /publicacion/crear
router.post('/crear', crearPublicacion);
export default router;