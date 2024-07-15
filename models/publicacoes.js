import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Usuario } from './usuario.js';
import { Administrador } from './administrador.js';

export const Publicacoes = sequelize.define('publicacoes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    imagens: {
      type: DataTypes.TEXT, // Usar TEXT para armazenar a string JSON
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('imagens');
        return JSON.parse(rawValue || '[]'); // Converte de volta para array
      },
      set(value) {
        this.setDataValue('imagens', JSON.stringify(value)); // Converte para string JSON
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
    }
  }, {
    tableName: 'publicacoes',
    timestamps: false
  });

Usuario.hasMany(Publicacoes, { foreignKey: 'userId' });
Publicacoes.belongsTo(Usuario, { foreignKey: 'userId' });

Administrador.hasMany(Publicacoes, { foreignKey: 'adminId' });
Publicacoes.belongsTo(Administrador, { foreignKey: 'adminId' });