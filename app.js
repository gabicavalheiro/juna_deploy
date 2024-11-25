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


    Usuario.hasMany(Meta, { foreignKey: 'userId', as: 'meta' });
    Meta.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
    
    console.log('Conexão com banco de dados realizada com sucesso');


    await Usuario.sync(),
      await Administrador.sync();
    await Event.sync();
    await Publicacoes.sync();
    await Meta.sync();
    // await sequelize.sync({ alter: true });

    // Adicione registros de exemplo se não existirem


  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
  }
}


conecta_db();

app.get('/', (req, res) => {
  res.send('JUNA SERVER');
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
