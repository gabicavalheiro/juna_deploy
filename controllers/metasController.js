import { Meta } from "../models/meta.js";
import { Usuario } from "../models/usuario.js"
import  { Administrador } from '../models/administrador.js';

export const createGoal = async (req, res) => {
    const { title, description, dueDate, platform, userId } = req.body;
    const adminId = req.params.adminId; // Extrair o adminId da rota
    console.log(req.body);
console.log(req.params.adminId);


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
            adminId
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


export const getGoalByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      let user = await Usuario.findByPk(userId, {
        include: [{ model: Meta, as: 'meta' }]
      });
  
      if (!user) {
        user = await Administrador.findByPk(userId, {
          include: [{ model: Meta, as: 'metaAdmin' }]
        });
      }
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
      }
  
      res.status(200).json(user.meta || user.metaAdmin);
    } catch (error) {
      console.error('Erro ao buscar metas do usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar metas do usuário. Por favor, tente novamente.' });
    }
  };