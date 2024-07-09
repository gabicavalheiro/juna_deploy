// authController.js

import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';
import bcrypt from 'bcrypt';

export const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Assume que o ID do usuário está no token decodificado (ver middleware de autenticação)

  try {
    // Busca o perfil do usuário com base no ID
    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Perfil do usuário não encontrado' });
    }

    // Retorna os dados do perfil como resposta
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
  }
};
export const getUserByEmail = async (email) => {
  try {
      // Busca na tabela de usuários
      const usuario = await Usuario.findOne({ where: { email } });
      if (usuario) {
          return { ...usuario.toJSON(), role: 'user' };
      }

      // Se não encontrar na tabela de usuários, busca na tabela de administradores
      const administrador = await Administrador.findOne({ where: { email } });
      if (administrador) {
          return { ...administrador.toJSON(), role: 'admin' };
      }

      // Se não encontrar em nenhuma das tabelas, retorna null
      return null;
  } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
  }
};

export const getUserByEmailRoute = async (req, res) => {
  const { email } = req.params;

  try {
      if (!email) {
          return res.status(400).json({ msg: 'Email não fornecido' });
      }

      const user = await getUserByEmail(email);
      if (!user) {
          return res.status(404).json({ msg: 'Usuário não encontrado' });
      }

      res.json(user);
  } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ msg: 'Erro ao buscar usuário' });
  }
};



