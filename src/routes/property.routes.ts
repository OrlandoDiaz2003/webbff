import { Router } from 'express';
import {
  getPropertyById,
  listProperties,
  createProperty,
  patchProperty,
  deleteProperty,
  getPropertiesByCityId
} from '../controllers/property.controller';

const router = Router();

// GET /api/v0/propiedad/ciudad/{id}
router.get('/ciudad/:id', getPropertiesByCityId);

// GET /api/v0/propiedad/{id}
router.get('/:id', getPropertyById);

// GET /api/v0/propiedad/
router.get('/', listProperties);

// POST /api/v0/propiedad/
router.post('/', createProperty);

// PATCH /api/v0/propiedad/{id}
router.patch('/:id', patchProperty);

// DELETE /api/v0/propiedad/{id}
router.delete('/:id', deleteProperty);

export default router;
