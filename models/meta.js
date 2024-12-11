import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Meta = sequelize.define('meta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em progresso', 'concluída'),
        defaultValue: 'pendente',
    },
    prazo: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    concluido: {
        type: DataTypes.BOOLEAN, // Campo booleano para indicar se está completo ou não
        defaultValue: false,     // Valor padrão: falso (não concluído)
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Se não for obrigatório
        references: {
            model: 'administradores',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
}, {
    tableName: 'metas',
    timestamps: true,
});
