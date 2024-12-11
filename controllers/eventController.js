import { Event } from "../models/event.js";
import { Usuario } from "../models/usuario.js";
import { Administrador } from "../models/administrador.js";
import { Op } from "sequelize";

// Criação de evento
export const handleSave = async (req, res) => {
    const { description, tag, time, eventDate, userId } = req.body;
    const adminId = req.params.adminId;

    if (!description || !tag || !time || !eventDate || !userId || !adminId) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    try {
        // Verificar se o usuário existe
        let user = await Usuario.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Verificar se o administrador existe
        let admin = await Administrador.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: "Administrador não encontrado" });
        }

        // Criar o evento
        const newEvent = await Event.create({
            description,
            tag,
            time,
            eventDate,
            userId,
            adminId,
            userType: admin ? "administrador" : "usuario",
        });

        res.status(201).json({ newEvent });
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: "Erro ao criar evento. Por favor, tente novamente." });
    }
};

// Obter eventos por usuário
export const getEventsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await Usuario.findByPk(userId, {
            include: [{ model: Event, as: "eventos" }],
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.json(user.eventos);
    } catch (error) {
        console.error("Erro ao buscar eventos do usuário:", error);
        res.status(500).json({ error: "Erro ao buscar eventos do usuário." });
    }
};

// Obter eventos por administrador
export const getEventsByAdminId = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Administrador.findByPk(adminId, {
            include: [
                {
                    model: Event,
                    as: "adminEvents",
                    include: { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
                },
            ],
        });

        if (!admin) {
            return res.status(404).json({ error: "Administrador não encontrado" });
        }

        res.json(admin.adminEvents);
    } catch (error) {
        console.error("Erro ao buscar eventos do administrador:", error);
        res.status(500).json({ error: "Erro ao buscar eventos do administrador." });
    }
};

// Listar todos os eventos
export const eventIndex = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: Administrador, as: "administrador", attributes: ["id", "nome"] },
                { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
            ],
        });

        res.json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ error: "Erro ao buscar eventos." });
    }
};

// Listar eventos do dia
export const eventDay = async (req, res) => {
    const { idType, id } = req.params;

    try {
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

        let events = [];

        if (idType === "user") {
            events = await Event.findAll({
                where: {
                    userId: id,
                    eventDate: { [Op.between]: [todayStart, todayEnd] },
                },
                include: [{ model: Usuario, as: "usuario", attributes: ["nome"] }],
            });
        } else if (idType === "admin") {
            events = await Event.findAll({
                where: {
                    adminId: id,
                    eventDate: { [Op.between]: [todayStart, todayEnd] },
                },
                include: [{ model: Usuario, as: "usuario", attributes: ["nome"] }],
            });
        } else {
            return res.status(400).json({ error: "Tipo de ID inválido." });
        }

        res.json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos do dia:", error);
        res.status(500).json({ error: "Erro ao buscar eventos do dia." });
    }
};

// Excluir evento
export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Evento não encontrado" });
        }

        await event.destroy();
        res.status(200).json({ message: "Evento removido com sucesso." });
    } catch (error) {
        console.error("Erro ao remover evento:", error);
        res.status(500).json({ error: "Erro ao remover evento. Por favor, tente novamente." });
    }
};


// Extrair eventos por userId
export const extractEventsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Verificar se o usuário existe
        const user = await Usuario.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Buscar eventos relacionados ao usuário
        const events = await Event.findAll({
            where: { userId },
            include: [
                { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
                { model: Administrador, as: "administrador", attributes: ["id", "nome"] },
            ],
        });

        // Verificar se há eventos
        if (events.length === 0) {
            return res.status(404).json({ error: "Nenhum evento encontrado para este usuário." });
        }

        res.json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos por userId:", error);
        res.status(500).json({ error: "Erro ao buscar eventos por userId. Por favor, tente novamente." });
    }
};
