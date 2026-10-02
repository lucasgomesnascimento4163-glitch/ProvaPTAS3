import express from 'express';
import EmprestimoRouter from "./routes/emprestimo.routes.js";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use((req, res, next) => {
	const startedAt = Date.now();
	res.on('finish', () => {
		console.log(`${req.method} ${req.originalUrl} — ${Date.now() - startedAt}ms`);
	});
	next();
});

app.use('/emprestimos', EmprestimoRouter);

app.use((req, _res, next) => {
	const error = new Error(`Rota ${req.originalUrl} não encontrada`);
	error.status = 404;
	next(error);
});

app.use((error, _req, res, next) => {
	if (res.headersSent) return next(error);
	res.status(error.status || 500).json({ erro: error.message || 'Erro interno do servidor' });
});

app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));
