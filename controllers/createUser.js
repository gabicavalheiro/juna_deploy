import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';
import validaSenha from '../utils/validaSenha.js';


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
    const { nome, email, senha, role, senhaConfirmacao} = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha || !role || !senhaConfirmacao) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
    }

    // Valida a senha
    const mensagemValidacao = validaSenha(senha);
    if (mensagemValidacao.length > 0) {
        return res.status(400).json({ msg: mensagemValidacao });
    }

    // Hash da senha antes de salvar no banco de dados
    const senhaHash = bcrypt.hashSync(senha, 10);

    try {
        let user;

        // Cria o usuário com base no papel (role)
        if (role === 'admin') {
            user = await Administrador.create({ nome, email, senha: senhaHash, senhaConfirmacao, role });
        } else if (role === 'user') {
            user = await Usuario.create({ nome, email, senha: senhaHash,  senhaConfirmacao, role, username });
        } else {
            return res.status(400).json({ msg: 'Role inválida' });
        }

        // Retorna o usuário criado
        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ msg: 'Erro ao criar usuário' });
    }
};
