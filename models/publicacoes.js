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
  }
}, {
  tableName: 'publicacoes',
  timestamps: false
});

Usuario.hasMany(Publicacoes, { foreignKey: 'userId', as: 'publicacoes' });
Publicacoes.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

Administrador.hasMany(Publicacoes, { foreignKey: 'adminId', as: 'publicacoesAdmin' });
Publicacoes.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador' });
