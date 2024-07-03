import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.js'; // Importe seu modelo de usuário aqui
import { Administrador } from '../models/administrador.js'; // Importe seu modelo de administrador aqui
import * as dotenv from 'dotenv';
import { getUserByEmail } from './authController.js';
dotenv.config();


export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo email
        const user = await getUserByEmail(email);

        // Se não encontrar o usuário, retorna erro
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ msg: 'Senha incorreta' });
        }

        // Gera o token JWT
        const token = jwt.sign({
            id: user.id,
            nome: user.nome,
            role: user.role // Assume que o campo de role está presente no modelo de usuário e administrador
        }, process.env.JWT_KEY, {
            expiresIn: "1h"
        });

        console.log("user id: " + user.id);

        // Retorna o token e as informações do usuário
        res.status(200).json({ token, userId: user.id, role: user.role });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ msg: 'Erro ao fazer login' });
    }
};



export const getDataFromTokenAndId = async (req, res) => {
    const { id, token } = req.params;

    if (!id || !token) {
        return res.status(400).json({ msg: 'ID de usuário e token são obrigatórios' });
    }

    try {
        // Verifica e decodifica o token JWT
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Verifica se o ID no token corresponde ao ID fornecido na rota
        if (decoded.id !== id) {
            return res.status(401).json({ msg: 'Token inválido para este usuário' });
        }

        // Verifica se o usuário existe no modelo de usuário
        let user = await Usuario.findByPk(id, { attributes: ['nome', 'email'] });

        // Se não encontrar no modelo de usuário, busca no modelo de administrador
        if (!user) {
            user = await Administrador.findByPk(id, { attributes: ['nome', 'email'] });
        }

        // Se não encontrar em nenhum dos modelos, retorna usuário não encontrado
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Retorna os dados do usuário (nome e email apenas)
        res.status(200).json({ nome: user.nome, email: user.email });
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token inválido' });
        }
        res.status(500).json({ msg: 'Erro ao obter dados do usuário' });
    }
};