import { Router } from "express";
import multer from 'multer';
import {
 getPublicationById,
 getAllPublicaciones,
 patchPublication,
 deletePublication,
 crearPublicacion,
 crearPublicacionCompleta,
 eliminarPublicacionCompleta,
 subirFoto,
 crearPublicacionConFotos,
 getPublicationsByPropertyIds,
 getPublicationsByCityId
} from '../controllers/publicacion.controller'

const router = Router();
const upload = multer();

// GET & POST /publicacion/por-propiedad
router.get('/por-propiedad', getPublicationsByPropertyIds);
router.post('/por-propiedades', getPublicationsByPropertyIds);

// GET /publicacion/ciudad/{id}
router.get('/ciudad/:id', getPublicationsByCityId);

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

//POST /publicacion/crear-con-fotos (Orquestador con archivos)
router.post('/crear-con-fotos', upload.array('fotos'), crearPublicacionConFotos);

//POST /publicacion/crear
router.post('/crear', crearPublicacion);

// POST /publicacion/:id/fotos
router.post('/:id/fotos', upload.single('foto'), subirFoto);

export default router;