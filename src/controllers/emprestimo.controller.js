import * as EmprestimoServices from "../services/emprestimo.service.js";

export async function listarEmprestimos(_req, res, next) {
  try {
    res.json(await EmprestimoServices.listActive());
  } catch (error) {
    next(error);
  }
}

export async function getEmprestimo(req, res, next) {
  try {
    res.json(await EmprestimoServices.findById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

export async function criarEmprestimo(req, res, next) {
  try {
    const emprestimo = await EmprestimoServices.create(req.body);
    res.status(201).json(emprestimo);
  } catch (error) {
    next(error);
  }
}

export async function replaceEmprestimo(req, res, next) {
  try {
    res.json(await EmprestimoServices.replace(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

export async function atualizarEmprestimo(req, res, next) {
  try {
    res.json(await EmprestimoServices.update(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

export async function retornarEmprestimo(req, res, next) {
  try {
    await EmprestimoServices.retornarEmprestimo(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}