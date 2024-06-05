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
app.use(routes)

async function conecta_db(){
 
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados realizada com sucesso');
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
  } finally {
    await sequelize.close();
  }

}
conecta_db()


app.get('/', (req, res) => {
  res.send('JUNA SERVER')
})

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
