import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';
import { Usuario } from './models/usuario.js';
import { Administrador } from './models/administrador.js';
import { Event } from './models/event.js'; // Adicione esta importação
import { Publicacoes } from './models/publicacoes.js'; // Adicione esta importação
import { sequelize } from './config/db.js';
import { Meta } from './models/meta.js';
import { Project } from './models/projeto.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: '*', // Ou configure para a origem específica do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Habilita o envio de credenciais (cookies, por exemplo)
}));

app.use(routes);

async function conecta_db() {
  try {


    await sequelize.authenticate();
    console.log('Conexão com banco de dados realizada com sucesso');

    // Configurar associações
    Usuario.hasMany(Meta, { foreignKey: 'userId', as: 'metas' });
    Meta.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
    Meta.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador' });
    Administrador.hasMany(Meta, { foreignKey: 'adminId', as: 'metasAdmin' });

    Usuario.hasMany(Event, { foreignKey: 'userId', as: 'eventos' });
    Event.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
    Event.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador' });
    Administrador.hasMany(Event, { foreignKey: 'adminId', as: 'eventosAdmin' });

    Usuario.hasMany(Publicacoes, { foreignKey: 'userId', as: 'publicacoes' });
    Publicacoes.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
    Administrador.hasMany(Publicacoes, { foreignKey: 'adminId', as: 'publicacoesAdmin' });
    Publicacoes.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador' });

    Administrador.hasMany(Project, { foreignKey: 'adminId', as: 'projetosAdmin' });
    Project.belongsTo(Administrador, { foreignKey: 'adminId', as: 'administrador' });
    Usuario.hasMany(Project, { foreignKey: 'userId', as: 'projetos' });
    Project.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
    Project.hasMany(Publicacoes, { foreignKey: 'projectId', as: 'publicacoes' });
    Publicacoes.belongsTo(Project, { foreignKey: 'projectId', as: 'projeto' });


    // await Publicacoes.sync({ force: true });

    // Sincronizar os modelos
    // await sequelize.sync({ alter: true }); // Sincroniza todas as tabelas
    console.log('Sincronização com o banco de dados concluída');
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
  }
}
conecta_db();


export const fetchGoalsByUserId = async (userId) => {
  const metas = await Meta.findAll({ where: { userId } });
  return metas;
};

export const fetchProjectsByUserId = async (userId) => {
  const projetos = await Project.findAll({ where: { userId } });
  return projetos;
};

export const fetchEventsByUserId = async (userId) => {
  const eventos = await Event.findAll({ where: { userId } });
  return eventos;
};



app.get('/', (req, res) => {
  res.send('JUNA SERVER');
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
