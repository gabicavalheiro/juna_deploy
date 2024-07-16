import { Event } from "../models/event.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";
import { Op } from "sequelize";


export const handleSave = async (req, res) => {
    const { description, tag, time, eventDate, userId } = req.body;
    const adminId = req.params.adminId; // Extrair o adminId da rota

    if (!description || !tag || !time || !eventDate || !userId || !adminId) {
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

        // Criação do evento associado ao calendário
        const newEvent = await Event.create({
            description,
            tag,
            time,
            eventDate,
            userId,
            adminId,
            userType: admin ? 'administrador' : 'usuario' // Define o tipo de usuário
        });

        res.status(201).json({ newEvent });
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ error: 'Erro ao criar evento. Por favor, tente novamente.' });
    }
};


export const getEventsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Verifica se o usuário existe na tabela de usuários
        let user = await Usuario.findByPk(userId, {
            include: [{ model: Event, as: 'userEvents' }] // Carrega os eventos associados como 'userEvents'
        });

        // Se não encontrou na tabela de usuários, verifica na tabela de administradores
        if (!user) {
            user = await Administrador.findByPk(userId, {
                include: [{ model: Event, as: 'adminEvents' }] // Carrega os eventos associados como 'adminEvents'
            });
        }

        // Se ainda não encontrou, retorna erro
        if (!user) {
            return res.status(404).json({ error: 'Usuário ou administrador não encontrado' });
        }

        // Acesso aos eventos dependendo do tipo de usuário encontrado
        let eventos = [];
        if (user.userType === 'administrador') {
            eventos = user.adminEvents; // Acessa os eventos associados como 'adminEvents'
        } else {
            eventos = user.userEvents; // Acessa os eventos associados como 'userEvents'
        }

        // Retorna os eventos associados ao usuário encontrado
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos do usuário. Por favor, tente novamente.' });
    }
};

export const getEventsByAdminId = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Verifica se o administrador existe na tabela de administradores
        const admin = await Administrador.findByPk(adminId, {
            include: [{ model: Event, as: 'adminEvents', include: { model: Usuario, as: 'usuario' } }]
             // Carrega os eventos associados como 'adminEvents'
        });

        // Se não encontrou o administrador, retorna erro
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado' });
        }

        // Retorna os eventos associados ao administrador encontrado
        res.json(admin.adminEvents);
    } catch (error) {
        console.error('Erro ao buscar eventos do administrador:', error);
        res.status(500).json({ error: 'Erro ao buscar eventos do administrador. Por favor, tente novamente.' });
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
    const { idType, id } = req.params; // Captura o tipo de ID e o ID da rota

    try {
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));

        let events = [];

        if (idType === 'user') {
            // Busca eventos do usuário
            events = await Event.findAll({
                where: {
                    userId: id,
                    eventDate: {
                        [Op.gte]: todayStart,
                        [Op.lte]: todayEnd
                    }
                },
                include: [{
                    model: Usuario, as: 'usuario',
                    attributes: ['nome'] // Inclui apenas o atributo 'name' do usuário
                }]
            });
        } else if (idType === 'admin') {
            // Busca eventos do administrador
            events = await Event.findAll({
                where: {
                    adminId: id,
                    eventDate: {
                        [Op.gte]: todayStart,
                        [Op.lte]: todayEnd
                    }
                },
                include: [{
                    model: Usuario, as: 'usuario',
                 attributes: ['nome'] // Inclui apenas o atributo 'name' do administrador
                }]
                
            });
        } else {
            return res.status(400).json({ error: 'Tipo de ID inválido' });
        }

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
