import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Usuario } from './usuario.js';
import { Administrador } from './administrador.js';

export const Project = sequelize.define('project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    projectDateInitial: {
        type: DataTypes.DATE,
        allowNull: false
    },
    projectDataFinal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        constraints: {
            name: 'fk_project_user' // Nome único
        }
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'administradores',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        constraints: {
            name: 'fk_project_admin' // Nome único
        }
    }
}, {
    tableName: 'projetos',
    timestamps: true // Para criar `createdAt` e `updatedAt`
});

