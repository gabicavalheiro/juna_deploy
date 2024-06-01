import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3000;

// Usuário autorizado (simulado, você pode buscar de um banco de dados)
const authorizedUser = {
  username: process.env.AUTHORIZED_USERNAME,
  passwordHash: process.env.AUTHORIZED_PASSWORD_HASH, // Use bcrypt para gerar e armazenar
};

// Rota para autenticação (login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verifique se o nome de usuário está correto
  if (username !== authorizedUser.username) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Verifique se a senha está correta
  const match = await bcrypt.compare(password, authorizedUser.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Se as credenciais estiverem corretas, gera um token JWT
  const token = jwt.sign({ username: authorizedUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Retorna o token como resposta
  res.json({ token });
});

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = decoded; // Decodificado, podemos acessar o nome de usuário
    next();
  });
};

// Middleware de autenticação para todas as rotas protegidas
app.use(authenticateToken);

// Rota protegida de exemplo
app.get('/data', (req, res) => {
  res.json({ message: 'Dados protegidos' });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
