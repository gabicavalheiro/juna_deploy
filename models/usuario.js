import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';
import { Meta } from './meta.js';

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
    allowNull: false,
  },
  senhaConfirmacao: {
    type: DataTypes.STRING(250),
  },
  imagemPerfil: {
    type: DataTypes.STRING(200) // Aqui você pode ajustar o tamanho conforme necessário
  },
  descricao: {
    type: DataTypes.STRING(400) // Aqui você pode ajustar o tamanho conforme necessário
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  paranoid: true
});

Usuario.beforeCreate(usuario => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(usuario.senha, salt);
  usuario.senha = hash;
});


Usuario.hasMany(Meta, {
  foreignKey: 'userId',
  as: 'metas', // Nome do campo associado
});
