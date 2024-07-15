import { Event } from "../models/event.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";
import { Op } from "sequelize";


export const handleSave = async (req, res) => {
    const { description, tag, time, eventDate, userId } = req.body;
    const adminUserId = req.params.userId; // Extrair o adminUserId da rota

    if (!description || !tag || !time || !eventDate || !userId || !adminUserId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        // Verifique se o usuário existe
        let user = await Usuario.findByPk(userId);
        let userType;

        if (user) {
            userType = 'usuario';
        } else {
            user = await Administrador.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
            }
            userType = 'administrador';
        }

        // Criação do novo evento
        const newEvent = await Event.create({
            description,
            tag,
            time,
            eventDate,
            userId, // ID do usuário selecionado
            adminUserId, // ID do administrador da rota
            userType // Tipo de usuário
        });

        // Aqui você pode salvar o evento também no ID do administrador, se necessário.
        await Event.create({
            description,
            tag,
            time,
            eventDate,
            userId: adminUserId, // Salvando com o ID do administrador
            adminUserId, // ID do administrador da rota
            userType: 'administrador' // Marcar como administrador
        });

        // Obter o nome do usuário
        const userName = user.nome || user.nome; // O nome deve ser acessado corretamente

        res.status(201).json({ ...newEvent.toJSON(), userId, userName });
    } catch (error) {
        console.error('Erro ao salvar evento:', error);
        res.status(500).json({ error: 'Erro ao salvar evento. Por favor, tente novamente.' });
    }
};





export const getEventsByUserId = async (req, res) => {
    const { userId } = req.params; // Corrigido para req.params.userId

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
    const { userId } = req.params; // Captura o userId da rota

    try {
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));

        const events = await Event.findAll({
            where: {
                userId: userId, // Filtra pelos eventos do usuário específico
                eventDate: {
                    [Op.gte]: todayStart, // Data maior ou igual ao início do dia
                    [Op.lte]: todayEnd // Data menor ou igual ao final do dia
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
