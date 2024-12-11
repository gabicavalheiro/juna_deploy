import { Administrador } from "../models/administrador.js";
import { Publicacoes } from "../models/publicacoes.js";
import { Usuario } from "../models/usuario.js";
import { Event } from "../models/event.js";
import { Project } from "../models/projeto.js";

// Exemplo de criação de publicação e evento associado
export const createPublicacao = async (req, res) => {
    const { imagens, data, empresa, descricao, plataforma, userId, titulo } = req.body;
    const adminId = req.params.adminId;

    // Validação dos campos obrigatórios
    if (!imagens || !data || !empresa || !descricao || !plataforma || !userId || !titulo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios, exceto o projectId!' });
    }

    try {
        // Verifique se o usuário existe
        let user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifique se o administrador existe
        let admin = await Administrador.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }


        // Criação da nova publicação
        const newPublicacao = await Publicacoes.create({
            imagens,
            data,
            empresa,
            descricao,
            plataforma,
            userId,
            titulo,
            adminId,
        });

        // Criação do evento associado ao calendário
        const formattedDate = `${new Date(data).getFullYear()}-${String(new Date(data).getMonth() + 1).padStart(2, '0')}-${String(new Date(data).getDate()).padStart(2, '0')}`;
        const newEvent = await Event.create({
            description: `Nova publicação: ${descricao}`,
            tag: 'PUBLICAÇÃO', // Tag específica para publicações
            time: new Date(data).toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric' }),
            eventDate: formattedDate,
            userId, // ID do usuário responsável pela publicação
            adminId, // ID do administrador da rota
            userType: 'usuario' // Tipo de usuário
        });

        res.status(201).json({ newPublicacao, newEvent });
    } catch (error) {
        console.error('Erro ao criar publicação e evento:', error);
        res.status(500).json({ error: 'Erro ao criar publicação e evento. Por favor, tente novamente.' });
    }
};

export const updatePublicacao = async (req, res) => {
    const { id } = req.params;
    const { imagens, data, empresa, descricao, plataforma, userId, adminId, titulo, projectId } = req.body;

    try {
        const publicacao = await Publicacoes.findByPk(id);
        if (!publicacao) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }

        await publicacao.update({ imagens, data, empresa, descricao, plataforma, userId, adminId, titulo });
        res.status(200).json(publicacao);
    } catch (error) {
        console.error('Erro ao atualizar publicação:', error);
        res.status(500).json({ error: 'Erro ao atualizar publicação. Por favor, tente novamente.' });
    }
};

export const deletePublicacao = async (req, res) => {
    const { id } = req.params;

    try {
        const publicacao = await Publicacoes.findByPk(id);
        if (!publicacao) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }

        await publicacao.destroy();
        res.status(200).json({ message: 'Publicação removida com sucesso' });
    } catch (error) {
        console.error('Erro ao remover publicação:', error);
        res.status(500).json({ error: 'Erro ao remover publicação. Por favor, tente novamente.' });
    }
};

export const getAllPublicacoes = async (req, res) => {
    try {
        const publicacoes = await Publicacoes.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'imagemPerfil'] },
                { model: Administrador, as: 'administrador', attributes: ['id', 'nome', 'imagemPerfil'] }
            ]
        });
        res.status(200).json(publicacoes);
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        res.status(500).json({ error: 'Erro ao buscar publicações' });
    }
};

export const getPublicacoesByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        let user = await Usuario.findByPk(userId, {
            include: [{ model: Publicacoes, as: 'publicacoes' }]
        });

        if (!user) {
            user = await Administrador.findByPk(userId, {
                include: [{ model: Publicacoes, as: 'publicacoesAdmin' }]
            });
        }

        if (!user) {
            return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
        }

        res.status(200).json(user.publicacoes || user.publicacoesAdmin);
    } catch (error) {
        console.error('Erro ao buscar publicações do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar publicações do usuário. Por favor, tente novamente.' });
    }
};

export const addPublicationToProject = async (req, res) => {
    const { imagens, data, empresa, descricao, plataforma, userId, titulo, projectId } = req.body;
    const adminId = req.params.adminId; // Extrair adminId da rota

    if (!imagens || !data || !empresa || !descricao || !plataforma || !userId || !adminId || !titulo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios, exceto o projectId!' });
    }

    try {
        // Verificar se o projeto existe (se fornecido)
        let project = null;
        if (projectId) {
            project = await Project.findByPk(projectId);
            if (!project) {
                return res.status(404).json({ error: `Projeto com ID "${projectId}" não encontrado` });
            }
        }

        // Verificar se o usuário existe
        const user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se o administrador existe
        const admin = await Administrador.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }

        // Criar a nova publicação vinculada ao projeto (se fornecido)
        const newPublicacao = await Publicacoes.create({
            imagens,
            data,
            empresa,
            descricao,
            plataforma,
            userId,
            titulo,
            adminId,
            projectId: projectId || null
        });

        // Criar o evento associado ao calendário
        const formattedDate = `${new Date(data).getFullYear()}-${String(new Date(data).getMonth() + 1).padStart(2, '0')}-${String(new Date(data).getDate()).padStart(2, '0')}`;
        const newEvent = await Event.create({
            description: `Nova publicação${project ? ` no projeto (${project.empresa})` : ''}: ${descricao}`,
            tag: 'PUBLICAÇÃO',
            time: new Date(data).toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric' }),
            eventDate: formattedDate,
            userId,
            adminId,
            userType: 'usuario'
        });

        res.status(201).json({
            message: 'Publicação adicionada com sucesso!',
            project,
            newPublicacao,
            newEvent
        });
    } catch (error) {
        console.error('Erro ao adicionar publicação ao projeto:', error);
        res.status(500).json({ error: 'Erro ao adicionar publicação ao projeto. Por favor, tente novamente.' });
    }
};

export const getPublicacoesByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findByPk(projectId, {
            include: [{ model: Publicacoes, as: 'publicacoes' }] // Alias correto
        });

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        res.status(200).json(project.publicacoes);
    } catch (error) {
        console.error('Erro ao buscar publicações do projeto:', error);
        res.status(500).json({ error: 'Erro ao buscar publicações do projeto. Por favor, tente novamente.' });
    }
};

export const fetchPublicacoesByUserId = async (userId) => {
    let user = await Usuario.findByPk(userId, {
        include: [{ model: Publicacoes, as: 'publicacoes' }]
    });

    if (!user) {
        user = await Administrador.findByPk(userId, {
            include: [{ model: Publicacoes, as: 'publicacoesAdmin' }]
        });
    }

    if (!user) {
        throw new Error('Usuário ou administrador não encontrado');
    }

    return user.publicacoes || user.publicacoesAdmin;
};
