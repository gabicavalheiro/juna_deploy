import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';
import { Meta } from './meta.js';
import { Project } from './projeto.js';
import { Publicacoes } from './publicacoes.js';
import { Event } from './event.js';

export const Usuario = sequelize.define('usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false
  },
  senhaConfirmacao: {
    type: DataTypes.STRING(250)
  },
  imagemPerfil: {
    type: DataTypes.STRING(200)
  },
  descricao: {
    type: DataTypes.STRING(400)
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  paranoid: true
});

// Hook para hashear a senha antes de salvar
Usuario.beforeCreate(usuario => {
  const salt = bcrypt.genSaltSync(12);
  usuario.senha = bcrypt.hashSync(usuario.senha, salt);
});


