import { Meta } from "../models/meta.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";
import { Op } from 'sequelize';


export const createGoal = async (req, res) => {
    const { metas, userId } = req.body; // `metas` será um array contendo as metas do frontend.
    const adminId = req.params.adminId; // Extrair o adminId da rota.

    console.log(req.body);
    console.log(req.params.adminId);

  

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
                concluido: false, 
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
        // Buscar metas que não estão concluídas
        const goals = await Meta.findAll({
            where: { concluido: false }, // Apenas metas pendentes
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

export const markGoalAsCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const meta = await Meta.findByPk(id);
        if (!meta) {
            return res.status(404).json({ error: 'Meta não encontrada.' });
        }

        // Atualizar status para "concluída"
        meta.status = 'concluída';
        meta.concluido = true;
        await meta.save();

        res.status(200).json({ message: 'Meta marcada como concluída.', meta });
    } catch (error) {
        console.error('Erro ao marcar meta como concluída:', error);
        res.status(500).json({ error: 'Erro ao marcar meta como concluída. Por favor, tente novamente.' });
    }
};




export const getGoalsByAdminId = async (req, res) => {
    const { adminId } = req.params; // Obtenha o adminId dos parâmetros da rota

    try {
        // Buscar metas pendentes para o adminId
        const goals = await Meta.findAll({
            where: { adminId, concluido: false }, // Apenas metas pendentes (concluido = false)
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] },
                { model: Administrador, as: 'administrador', attributes: ['id', 'nome'] }
            ]
        });

        if (goals.length === 0) {
            return res.status(404).json({ error: 'Nenhuma meta pendente encontrada para este administrador.' });
        }

        res.status(200).json(goals);
    } catch (error) {
        console.error('Erro ao buscar metas pendentes:', error);
        res.status(500).json({ error: 'Erro ao buscar metas pendentes. Por favor, tente novamente.' });
    }
};


    export const getCompletedGoals = async (req, res) => {
        const { adminId } = req.params; // Obtenha o adminId dos parâmetros da rota
    
        try {
            // Buscar metas concluídas para o adminId
            const metasConcluidas = await Meta.findAll({
                where: {
                    adminId,        // Filtrar pelo adminId
                    concluido: true // Apenas metas concluídas
                },
                include: [
                    { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] },
                    { model: Administrador, as: 'administrador', attributes: ['id', 'nome'] }
                ]
            });
    
            if (!metasConcluidas.length) {
                return res.status(404).json({ error: 'Nenhuma meta concluída encontrada para este administrador.' });
            }
    
            res.status(200).json(metasConcluidas);
        } catch (error) {
            console.error('Erro ao buscar metas concluídas:', error);
            res.status(500).json({ error: 'Erro ao buscar metas concluídas.' });
        }
    };
    

    export const getWeeklyGoals = async (req, res) => {
        const { adminId } = req.params;
        const hoje = new Date(); 
        const fimDaSemana = new Date(); 
        fimDaSemana.setDate(hoje.getDate() + 7); 
    
        try {
            // Buscar metas previstas para a semana
            const metasSemana = await Meta.findAll({
                where: {
                    adminId,      
                    concluido: false, 
                    prazo: {
                        [Op.between]: [hoje, fimDaSemana] 
                    }
                },
                include: [
                    { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] },
                    { model: Administrador, as: 'administrador', attributes: ['id', 'nome'] }
                ]
            });
    
            if (!metasSemana.length) {
                return res.status(404).json({ error: 'Nenhuma meta prevista para esta semana encontrada para este administrador.' });
            }
    
            res.status(200).json(metasSemana);
        } catch (error) {
            console.error('Erro ao buscar metas da semana:', error);
            res.status(500).json({ error: 'Erro ao buscar metas da semana.' });
        }
    };
    

    export const markGoalAsPending = async (req, res) => {
        const { id } = req.params;
    
        try {
            const meta = await Meta.findByPk(id);
            if (!meta) {
                return res.status(404).json({ error: 'Meta não encontrada.' });
            }
    
            // Atualizar status para "pendente"
            meta.status = 'pendente';
            meta.concluido = false;
            await meta.save();
    
            res.status(200).json({ message: 'Meta marcada como pendente.', meta });
        } catch (error) {
            console.error('Erro ao voltar meta para pendente:', error);
            res.status(500).json({ error: 'Erro ao voltar meta para pendente. Por favor, tente novamente.' });
        }
    };
    