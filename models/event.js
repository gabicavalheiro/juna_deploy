// models/event.js

import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import { Usuario } from './usuario.js';
import { Administrador } from './administrador.js';

export const Event = sequelize.define('Event', {
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tag: {
        type: DataTypes.ENUM('REUNIÃO', 'PUBLICAÇÃO', 'PARCERIA'),
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^([01]\d|2[0-3]):([0-5]\d)$/, // Valida hora:minutos no formato 24h
        },
    },
    eventDate: {
        type: DataTypes.DATEONLY, // Use DATEONLY para datas sem hora
        allowNull: false,
        validate: {
            isDate: true,
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userType: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

Usuario.hasMany(Event, { foreignKey: 'userId', as: 'userEvents', constraints: false });
Administrador.hasMany(Event, { foreignKey: 'adminId', as: 'adminEvents', constraints: false });
Event.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario', constraints: false });
Event.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador', constraints: false });
