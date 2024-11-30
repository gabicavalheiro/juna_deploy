import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Project } from './projeto.js'; // Importa o modelo corretamente

export const Publicacoes = sequelize.define('publicacoes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    imagens: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('imagens');
            return JSON.parse(rawValue || '[]');
        },
        set(value) {
            this.setDataValue('imagens', JSON.stringify(value));
        }
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    plataforma: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'administradores',
            key: 'id'
        }
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'projects', // Nome da tabela referenciada
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      constraints: {
          name: 'fk_publicacoes_project' // Nome único
      }
  }
  
}, {
    tableName: 'publicacoes',
    timestamps: false
});


