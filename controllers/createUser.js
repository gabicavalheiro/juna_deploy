import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';
import validaSenha from '../utils/validaSenha.js';
export const createUser = async (req, res) => {
    const { nome, email, senha, role, username } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha || !role || !username) {
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
            user = await Administrador.create({ nome, email, senha: senhaHash, role, username });
        } else if (role === 'user') {
            user = await Usuario.create({ nome, email, senha: senhaHash, role, username });
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
