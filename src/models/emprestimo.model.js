import { readEmprestimo, writeEmprestimo } from "../db.js";

export async function findAll() {
  return readEmprestimo();
}

export async function findById(id) {
  const emprestimos = await readEmprestimo();
  return emprestimos.find(emprestimo => emprestimo.id === id) ?? null;
}

export async function create(payload) {
  const emprestimos = await readEmprestimo();
  const nextId = emprestimos.length
    ? Math.max(...emprestimos.map(emprestimo => emprestimo.id)) + 1
    : 1;
  const emprestimo = {
    id: nextId,
    nomeAluno: payload.nomeAluno,
    livro: payload.livro,
    devolvidoEm: null
  };

  await writeEmprestimo([...emprestimos, emprestimo]);
  return emprestimo;
}

export async function update(id, payload) {
  const emprestimos = await readEmprestimo();
  const index = emprestimos.findIndex(emprestimo => emprestimo.id === id);
  if (index === -1) return null;

  emprestimos[index] = { ...emprestimos[index], ...payload, id };
  await writeEmprestimo(emprestimos);
  return emprestimos[index];
}