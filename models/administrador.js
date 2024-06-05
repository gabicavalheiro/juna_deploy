import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'

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
        type: DataTypes.STRING(250),
        allowNull: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      timestamps: false, // Desabilita os campos de timestamp (createdAt e updatedAt)
      paranoid: true 
      // Habilita o soft delete (paranoid mode)
      //o Sequelize simplesmente define um marcador especial no registro (por exemplo, um campo deletedAt) para indicar que ele foi excluído. 
      //Isso permite que os registros "excluídos" ainda sejam recuperados posteriormente, se necessário.
    });


    //que significa que ele será executado antes que um novo registro seja inserido na tabela associada à model Administrador.
Administrador.beforeCreate(administradores => {
  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(administradores.senha, salt)
  administradores.senha = hash  
});