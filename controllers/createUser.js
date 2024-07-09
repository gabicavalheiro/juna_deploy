import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';
import validaSenha from '../utils/validaSenha.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

// Função para listar todos os usuários
export const listUsers = async (req, res) => {
    try {
        // Busca todos os administradores
        const admins = await Administrador.findAll();

        // Busca todos os usuários
        const users = await Usuario.findAll();

        // Formata a resposta separando administradores e usuários
        res.status(200).json({
            admins,
            users
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ msg: 'Erro ao listar usuários' });
    }
};


export const createUser = async (req, res) => {
  const { nome, email, senha, role, senhaConfirmacao, username } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha || !role ) {
    return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
  }

  // Verifica se username foi fornecido para usuários
  if (role === 'user' && !username) {
    return res.status(400).json({ msg: 'Username é obrigatório para usuários' });
  }

  // Valida a senha usando a função validaSenha
  const mensagemValidacao = validaSenha(senha);
  if (mensagemValidacao.length > 0) {
    return res.status(400).json({ msg: mensagemValidacao });
  }

  // Verifica se senha e senhaConfirmacao são iguais
  if (senha !== senhaConfirmacao) {
    return res.status(400).json({ msg: 'A senha e a confirmação de senha não coincidem' });
  }

  try {
    let user;

    // Cria o usuário com base no papel (role)
    if (role === 'admin') {
      user = await Administrador.create({ nome, email, senha, role });
    } else if (role === 'user') {
      user = await Usuario.create({ nome, email, senha, role, username });
    } else {
      return res.status(400).json({ msg: 'Role inválida' });
    }

    // Gera o token JWT
    const token = jwt.sign({
      id: user.id,
      nome: user.nome,
      role: user.role
    }, process.env.JWT_KEY, {
      expiresIn: "1h"
    });

    // Envia o token no cabeçalho da resposta
    res.status(201).header('Authorization', `Bearer ${token}`).json({ user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ msg: 'Erro ao criar usuário' });
  }
};

  
// Função para obter token do usuário por ID
export const getUserTokenById = async (req, res) => {
    const userId = req.params.id;

    try {
        // Busca as informações do usuário pelo ID
        const usuario = await Usuario.findByPk(userId);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        // Monta as informações que deseja incluir no token
        const tokenPayload = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            role: 'user' // Você pode ajustar conforme a lógica do seu sistema de permissões
            // Adicione outros campos conforme necessário
        };

        // Gera o token com as informações do usuário
        const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: '1h' });

        // Retorna o token como resposta
        return res.status(200).header('Authorization', `Bearer ${token}`).json({ token });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
    }
};

