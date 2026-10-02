import { Router } from 'express';
import {
  criarEmprestimo,
  getEmprestimo,
  listarEmprestimos,
  replaceEmprestimo,
  retornarEmprestimo,
  atualizarEmprestimo
} from "../controllers/emprestimo.controller.js";

const router = Router();

router.get('/', listarEmprestimos);
router.post('/', criarEmprestimo);
router.get('/:id', getEmprestimo);
router.put('/:id', replaceEmprestimo);
router.patch('/:id', atualizarEmprestimo);
router.delete('/:id', retornarEmprestimo);

export default router;