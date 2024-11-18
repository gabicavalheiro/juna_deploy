import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.js'; // Importe seu modelo de usuário aqui
import { Administrador } from '../models/administrador.js'; // Importe seu modelo de administrador aqui
import * as dotenv from 'dotenv';
import { getUserByEmail } from './authController.js';

dotenv.config();

// Função auxiliar para verificar senha e gerar token
const verifyPasswordAndGenerateToken = async (user, senha) => {
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return null;

    return jwt.sign(
        { id: user.id, nome: user.nome, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
    );
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

        // Verifica a senha e gera o token, retornando erro caso a senha esteja incorreta
        const token = await verifyPasswordAndGenerateToken(user, senha);
        if (!token) return res.status(401).json({ msg: 'Senha incorreta' });

        console.log("user id: " + user.id);
        res.status(200).json({ token, userId: user.id, role: user.role });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ msg: 'Erro ao fazer login' });
    }
};

export const getDataFromTokenAndId = async (req, res) => {
    const { id, token } = req.params;

    if (!id || !token) return res.status(400).json({ msg: 'ID de usuário e token são obrigatórios' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (decoded.id !== id) return res.status(401).json({ msg: 'Token inválido para este usuário' });

        // Busca o usuário apenas uma vez
        const user = await Usuario.findByPk(id, { attributes: ['nome', 'email'] }) ||
                     await Administrador.findByPk(id, { attributes: ['nome', 'email'] });

        if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

        res.status(200).json({ nome: user.nome, email: user.email });
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token inválido' });
        }
        res.status(500).json({ msg: 'Erro ao obter dados do usuário' });
    }
};
