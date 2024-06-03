import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3000;

// Usuário autorizado (simulado, você pode buscar de um banco de dados)
const authorizedUser = {
  username: process.env.AUTHORIZED_USERNAME,
  passwordHash: process.env.AUTHORIZED_PASSWORD_HASH, // Use bcryptjs para gerar e armazenar
};

// Middleware de autenticação
const authenticateUser = async (req, res, next) => {
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

  // Se as credenciais estiverem corretas, gera um token JWT
  const token = jwt.sign({ username: authorizedUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Adiciona o token à requisição e continua
  req.token = token;
  next();
};

