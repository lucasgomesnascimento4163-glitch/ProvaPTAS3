import * as EmprestimoModel from "../models/emprestimo.model.js";

function serviceError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validarCamposDeTexto(payload, fields) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw serviceError('O body deve ser um objeto', 400);
  }

  const validado = {};
  for (const field of fields) {
    if (typeof payload[field] !== 'string' || !payload[field].trim()) {
      throw serviceError(`${field} é obrigatório`, 400);
    }
    validado[field] = payload[field].trim();
  }
  return validado;
}

async function livroEstaValido(livro, EmprestimoIgnoradoId) {
  const emprestimos = await EmprestimoModel.findAll();
  const JaPegado = emprestimos.some(emprestimo =>
    emprestimo.id !== EmprestimoIgnoradoId && emprestimo.devolvidoEm === null && emprestimo.livro === livro
  );
  if (JaPegado) {
    throw serviceError('Este livro já está emprestado', 409);
  }
}

export async function listActive() {
  const emprestimos = await EmprestimoModel.findAll();
  return emprestimos.filter(emprestimo => emprestimo.devolvidoEm === null);
}

export async function findById(id) {
  const emprestimo = await EmprestimoModel.findById(id);
  if (!emprestimo) throw serviceError('Empréstimo não encontrado', 404);
  return emprestimo;
}

export async function create(payload) {
  const data = validarCamposDeTexto(payload, ['nomeAluno', 'livro']);
  await livroEstaValido(data.livro);
  return EmprestimoModel.create(data);
}

export async function replace(id, payload) {
  const data = validarCamposDeTexto(payload, ['nomeAluno', 'livro']);
  const EmprestimoDoMomento = await findById(id);
  await livroEstaValido(data.livro, id);
  return EmprestimoModel.update(id, { ...data, devolvidoEm: EmprestimoDoMomento.devolvidoEm });
}

export async function update(id, payload) {
  const EmprestimoDoMomento = await findById(id);
  const data = {};

  for (const field of ['nomeAluno', 'livro']) {
    if (Object.hasOwn(payload ?? {}, field)) {
      Object.assign(data, validarCamposDeTexto({ [field]: payload[field] }, [field]));
    }
  }

  const atualizarEmprestimo = { ...EmprestimoDoMomento, ...data, id };
  await livroEstaValido(atualizarEmprestimo.livro, id);
  return EmprestimoModel.update(id, data);
}

export async function retornarEmprestimo(id) {
  const emprestimo = await findById(id);
  if (emprestimo.devolvidoEm !== null) {
    throw serviceError('Este empréstimo já foi devolvido', 409);
  }
  return EmprestimoModel.update(id, { devolvidoEm: new Date().toISOString() });
}