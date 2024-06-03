import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Usuário autorizado (simulado, você pode buscar de um banco de dados)
const authorizedUser = {
  username: process.env.AUTHORIZED_USERNAME,
  passwordHash: process.env.AUTHORIZED_PASSWORD_HASH,
};

// Rota única para autenticação e acesso aos dados protegidos
app.get('/api', async (req, res) => {
  const { username, password } = req.query;

  // Verifique se o nome de usuário e senha foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ error: 'Favor fornecer nome de usuário e senha' });
  }

  // Verifique se o nome de usuário está correto
  if (username !== authorizedUser.username) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Verifique se a senha está correta
  const match = await bcrypt.compare(password, authorizedUser.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Se as credenciais estiverem corretas, retorne os dados protegidos
  res.json({
    message: 'Autenticação bem-sucedida',
    data: {
      message: 'Dados protegidos'
    }
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
