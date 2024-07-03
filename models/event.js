
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
  });
  Event.belongsTo(Usuario);
  Usuario.hasMany(Event);

  Event.belongsTo(Administrador);
  Administrador.hasMany(Event);