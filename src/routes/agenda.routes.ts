import { Router } from 'express';
import {
  getAgendaByCliente,
  getAgendaByVendedor,
  deleteAgendaEntry,
  createAgendaEntry
} from '../controllers/agenda.controller';

const router = Router();

// GET /api/v0/agenda/cliente/{id}
router.get('/cliente/:id', getAgendaByCliente);

// GET /api/v0/agenda/vendedor/{id}
router.get('/vendedor/:id', getAgendaByVendedor);

// DELETE /api/v0/agenda/{id}
router.delete('/:id', deleteAgendaEntry);

// POST /api/v0/agenda/
router.post('/', createAgendaEntry);

export default router;
