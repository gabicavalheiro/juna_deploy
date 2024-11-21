import { Meta } from "../models/meta";

export const createGoal = async (req, res) => {
    const { title, description, dueDate, platform, userId } = req.body;
    const adminId = req.params.adminId; // Extrair o adminId da rota

    if (!description || !title || !dueDate || !platform || !userId || !adminId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        
        let user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        let admin = await Administrador.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }

        const newGoal= await Meta.create({
            description,
            dueDate,
            platform,
            title,
            userId,
            adminId,
            userType: admin ? 'administrador' : 'usuario' // Define o tipo de usuário
        });

        res.status(201).json({ newGoal });
    } catch (error) {
        console.error('Erro ao criar meta:', error);
        res.status(500).json({ error: 'Erro ao criar meta. Por favor, tente novamente.' });
    }
};


export const goalIndex = async (req, res) => {
    try {
        const goals = await Meta.findAll();
        res.json(goals);
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
            return res.status(404).json({ error: 'Meta não encontrado' });
        }

        await goal.destroy();
        res.status(200).json({ message: 'meta removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover meta:', error);
        res.status(500).json({ error: 'Erro ao remover meta. Por favor, tente novamente.' });
    }
};
