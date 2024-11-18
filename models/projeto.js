import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import { Usuario } from './usuario.js';
import { Administrador } from './administrador.js';

// Definição do modelo de Projeto (Project)
export const Project = sequelize.define('Project', {
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    projectDate: {
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
    }
});

// Usuário (Usuario) tem muitos projetos
Usuario.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

// Administrador tem muitos projetos
Administrador.hasMany(Project, { foreignKey: 'adminId', as: 'projects' });
Project.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador' });

// Projeto (Project) tem muitos eventos (Event)
Project.hasMany(Event, { foreignKey: 'projectId', as: 'events' });
Event.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
