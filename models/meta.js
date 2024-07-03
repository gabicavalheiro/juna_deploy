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
  }, {
    tableName: 'metas',
    timestamps: false,
  });
  
  Meta.belongsTo(Usuario);
  Usuario.hasMany(Meta);