import { Event } from "../models/event.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";
import { Op } from "sequelize";

export const handleSave = async (req, res) => {
    const { description, tag, time, eventDate } = req.body;
    const { userId } = req.params; // Captura userId da rota

    if (!description || !tag || !time || !eventDate) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        // Verifica se o usuário existe na tabela de usuários
        let user = await Usuario.findByPk(userId);

        // Se não encontrou na tabela de usuários, verifica na tabela de administradores
        if (!user) {
            user = await Administrador.findByPk(userId);
        }

        // Se ainda não encontrou, retorna erro
        if (!user) {
            return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
        }

        // Cria o evento associado ao usuário ou administrador encontrado
        const newEvent = await Event.create({
            description,
            tag,
            time,
            eventDate,
            usuarioId: userId  // Associa o evento ao usuário ou administrador específico pelo seu ID
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Erro ao salvar evento:', error);
        res.status(500).json({ error: 'Erro ao salvar evento. Por favor, tente novamente.' });
    }
};

export const getEventsByUserId = async (req, res) => {
    const { userId } = req.params; // Captura userId da rota

    try {
        // Verifica se o usuário existe na tabela de usuários
        let user = await Usuario.findByPk(userId, {
            include: [{ model: Event }]  // Inclui eventos associados ao usuário
        });

        // Se não encontrou na tabela de usuários, verifica na tabela de administradores
        if (!user) {
            user = await Administrador.findByPk(userId, {
                include: [{ model: Event }]  // Inclui eventos associados ao administrador
            });
        }

        // Se ainda não encontrou, retorna erro
        if (!user) {
            return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
        }

        // Retorna os eventos associados ao usuário encontrado
        res.json(user.Events);
    } catch (error) {
        console.error('Erro ao buscar eventos do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos do usuário. Por favor, tente novamente.' });
    }
};

export const eventIndex = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
};

export const eventDay = async (req, res) => {
    try {
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));

        const events = await Event.findAll({
            where: {
                eventDate: {
                    [Op.between]: [todayStart, todayEnd]
                }
            }
        });

        res.json(events);
    } catch (error) {
        console.error('Erro ao buscar eventos de hoje:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos de hoje' });
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }

        await event.destroy();
        res.status(200).json({ message: 'Evento removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover evento:', error);
        res.status(500).json({ error: 'Erro ao remover evento. Por favor, tente novamente.' });
    }
};
