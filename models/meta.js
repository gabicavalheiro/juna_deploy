import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Usuario } from './usuario.js';

export const Meta = sequelize.define('meta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'userId',
      constraints: {
        name: 'fk_metas_usuarios', // Nome explícito para a constraint
      }
  }
  

  }, {
    tableName: 'metas',
    timestamps: false,
  });




