// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import routes from './routes.js'
import { Usuario } from './models/usuario.js';
import { Administrador } from './models/administrador.js';
import { sequelize } from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({
  origin: '*', // URL do seu cliente, ou '*' para aceitar todas as origens
  methods: '*', // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type'], // Headers permitidos
  credentials: true, // Permite o envio de credenciais (cookies, por exemplo)

}));
app.use(routes)






async function conecta_db() {

  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados realizada com sucesso');

    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
  }

}
conecta_db()






app.get('/', (req, res) => {
  res.send('JUNA SERVER')
})

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
