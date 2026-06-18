import { Router } from 'express';
import {
  getAgendaByCliente,
  getAgendaByVendedor,
  deleteAgendaEntry,
  createAgendaEntry,
  cambiarEstado,
  getPublicacionesPendientes
} from '../controllers/agenda.controller';

const router = Router();

// GET /api/v0/agenda/cliente/{id}
router.get('/cliente/:id', getAgendaByCliente);

// GET /api/v0/agenda/cliente/{id}/publicaciones-pendientes
router.get('/cliente/:id/publicaciones-pendientes', getPublicacionesPendientes);

// GET /api/v0/agenda/vendedor/{id}
router.get('/vendedor/:id', getAgendaByVendedor);

// DELETE /api/v0/agenda/{id}
router.delete('/:id', deleteAgendaEntry);

// POST /api/v0/agenda/
router.post('/', createAgendaEntry);

// PUT /api/v0/agenda/{id}/estado
router.put('/:id/estado', cambiarEstado);

export default router;
