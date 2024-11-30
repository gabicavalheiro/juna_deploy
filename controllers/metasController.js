import { Meta } from "../models/meta.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";

export const createGoal = async (req, res) => {
    const { metas, userId } = req.body; // `metas` será um array contendo as metas do frontend.
    const adminId = req.params.adminId; // Extrair o adminId da rota.

    console.log(req.body);
    console.log(req.params.adminId);

    // Verificar se as metas foram enviadas e são exatamente 3.
    if (!Array.isArray(metas) || metas.length !== 3) {
        return res.status(400).json({ error: 'É necessário fornecer exatamente 3 metas.' });
    }

    try {
        // Verifique se o usuário existe.
        const user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifique se o administrador existe.
        const admin = await Administrador.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }

        // Criar as metas no banco de dados.
        const createdGoals = await Promise.all(
            metas.map(meta => Meta.create({
                ...meta, // Adiciona as propriedades individuais de cada meta.
                userId,
                adminId,
            }))
        );

        res.status(201).json({ metas: createdGoals });
    } catch (error) {
        console.error('Erro ao criar metas:', error);
        res.status(500).json({ error: 'Erro ao criar metas. Por favor, tente novamente.' });
    }
};

export const goalIndex = async (req, res) => {
    try {
        const goals = await Meta.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] },
                { model: Administrador, as: 'administrador', attributes: ['id', 'nome'] }
            ]
        });
        res.status(200).json(goals);
    } catch (error) {
        console.error('Erro ao buscar metas:', error);
        res.status(500).json({ error: 'Erro ao buscar metas' });
    }
};

export const deleteGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const goal = await Meta.findByPk(id);
        if (!goal) {
            return res.status(404).json({ error: 'Meta não encontrada' });
        }

        await goal.destroy();
        res.status(200).json({ message: 'Meta removida com sucesso' });
    } catch (error) {
        console.error('Erro ao remover meta:', error);
        res.status(500).json({ error: 'Erro ao remover meta. Por favor, tente novamente.' });
    }
};

export const getGoalByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Buscar metas relacionadas ao usuário.
        const user = await Usuario.findByPk(userId, {
            include: [{ model: Meta, as: 'metas' }]
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(user.metas);
    } catch (error) {
        console.error('Erro ao buscar metas do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar metas do usuário. Por favor, tente novamente.' });
    }
};
