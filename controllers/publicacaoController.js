import { Administrador } from "../models/administrador.js";
import { Publicacoes } from "../models/publicacoes.js";
import { Usuario } from "../models/usuario.js";



export const createPublicacao = async (req, res) => {
    const { imagens, data, empresa, descricao, plataforma, userId } = req.body;
    const adminId = req.params.adminId; // Extrair o adminId da rota

    if (!imagens || !data || !empresa || !descricao || !plataforma || !userId || !adminId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
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
            adminId
        });

        res.status(201).json(newPublicacao);
    } catch (error) {
        console.error('Erro ao criar publicação:', error);
        res.status(500).json({ error: 'Erro ao criar publicação. Por favor, tente novamente.' });
    }
};


export const updatePublicacao = async (req, res) => {
    const { id } = req.params;
    const { imagens, data, empresa, descricao, plataforma, userId, adminId } = req.body;

    try {
        const publicacao = await Publicacoes.findByPk(id);
        if (!publicacao) {
            return res.status(404).json({ error: 'Publicação não encontrada' });
        }

        await publicacao.update({ imagens, data, empresa, descricao, plataforma, userId, adminId });
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
        const publicacoes = await Publicacoes.findAll();
        res.status(200).json(publicacoes);
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        res.status(500).json({ error: 'Erro ao buscar publicações' });
    }
};



export const getPublicacoesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verifica se o usuário existe na tabela de usuários
    let user = await Usuario.findByPk(userId, {
      include: [{ model: Publicacoes, as: 'publicacoes' }]  // Inclui publicações associadas ao usuário
    });

    // Se não encontrou na tabela de usuários, verifica na tabela de administradores
    if (!user) {
      user = await Administrador.findByPk(userId, {
        include: [{ model: Publicacoes, as: 'publicacoes' }]  // Inclui publicações associadas ao administrador
      });
    }

    // Se ainda não encontrou, retorna erro
    if (!user) {
      return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
    }

    // Retorna as publicações associadas ao usuário encontrado
    res.status(200).json(user.publicacoes);
  } catch (error) {
    console.error('Erro ao buscar publicações do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar publicações do usuário. Por favor, tente novamente.' });
  }
};
