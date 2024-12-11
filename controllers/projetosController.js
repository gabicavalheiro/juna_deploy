import { Meta } from "../models/meta.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";
import { Project } from "../models/projeto.js";
import { Publicacoes } from "../models/publicacoes.js";

export const createProject = async (req, res) => {
    const { empresa, description, projectDateInitial, projectDataFinal, userId } = req.body;
    const adminId = req.params.adminId; // Extrair o adminId da rota
    console.log(req.body);
    console.log(req.params.adminId);

    if (!description || !empresa || !projectDateInitial || !projectDataFinal || !userId || !adminId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const admin = await Administrador.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }

        const newProject = await Project.create({
            description,
            empresa,
            projectDataFinal,
            projectDateInitial,
            userId,
            adminId,
        });

        res.status(201).json({ newProject });
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(500).json({ error: 'Erro ao criar projeto. Por favor, tente novamente.' });
    }
};

export const projectIndex = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: Publicacoes,
                    as: 'publicacoes', // Alias definido na associação
                    attributes: ['id', 'titulo', 'descricao', 'data'], // Campos desejados das publicações
                },
            ],
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};


export const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        await project.destroy();
        res.status(200).json({ message: 'Projeto removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover projeto:', error);
        res.status(500).json({ error: 'Erro ao remover projeto. Por favor, tente novamente.' });
    }
};

export const getProjectByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Busca para usuários normais
        const user = await Usuario.findByPk(userId, {
            include: [{ model: Project, as: 'projetos' }], // Alias correto
        });

        if (user) {
            return res.status(200).json(user.projetos); // Retorna projetos do usuário
        }

        // Busca para administradores
        const admin = await Administrador.findByPk(userId, {
            include: [{ model: Project, as: 'projetosAdmin' }], // Alias correto
        });

        if (!admin) {
            return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
        }

        // Retorna os projetos do administrador
        return res.status(200).json(admin.projetosAdmin);
    } catch (error) {
        console.error('Erro ao buscar projetos do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos do usuário. Por favor, tente novamente.' });
    }
};


export const getProjectById = async (req, res) => {
    const { id } = req.params; // Extrai o ID do projeto a partir dos parâmetros da rota

    try {
        const project = await Project.findByPk(id, {
            include: [
                {
                    model: Publicacoes,
                    as: 'publicacoes', // Alias definido na associação
                    attributes: ['id', 'titulo', 'descricao', 'data'], // Campos desejados das publicações
                },
                {
                    model: Usuario,
                    as: 'usuario', // Alias definido para o usuário vinculado
                    attributes: ['id', 'username', 'imagemPerfil'], // Campos desejados do usuário
                },
                {
                    model: Administrador,
                    as: 'administrador', // Alias definido para o administrador vinculado
                    attributes: ['id', 'imagemPerfil'], // Campos desejados do administrador
                },
            ],
        });

        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Erro ao buscar projeto por ID:', error);
        res.status(500).json({ error: 'Erro ao buscar projeto. Por favor, tente novamente.' });
    }
};
