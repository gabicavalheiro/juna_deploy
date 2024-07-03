import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';

export const Administrador = sequelize.define('administradores', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    allowNull: false,
  },
  senhaConfirmacao: {
    type: DataTypes.STRING(250),
  },
  imagemPerfil: {
    type: DataTypes.STRING(200) // Ajuste o tamanho conforme necessário
  }
}, {
  tableName: 'administradores',
  timestamps: false,
  paranoid: true
});

Administrador.beforeCreate(administrador => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(administrador.senha, salt);
  administrador.senha = hash;
});
