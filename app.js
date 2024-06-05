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
app.use(cors())
app.use(routes)

// Usuário autorizado
const authorizedUser = {
  username: process.env.AUTHORIZED_USERNAME,
  passwordHash: process.env.AUTHORIZED_PASSWORD_HASH,
};

// Rota única para autenticação e acesso aos dados protegidos
app.get('/api', (req, res) => {
  const { username, password } = req.query;

  // Verifique se o nome de usuário e hash da senha foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ error: 'Favor fornecer nome de usuário e hash da senha' });
  }

  // Verifique se o nome de usuário está correto
  if (username !== authorizedUser.username) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Verifique se o hash da senha está correto
  if (password !== authorizedUser.passwordHash) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Se as credenciais estiverem corretas, retorne os dados protegidos
  res.json({
    message: 'Autenticação bem-sucedida',
    data: {
      message: 'Dados protegidos'
    }
  });
});


async function conecta_db(){
 
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados realizada com sucesso');
    await Usuario.sync()
    await Administrador.sync()
   
  

  } catch (error) {
    console.error('Erro na conexão com o banco: ', error);
  }
}
conecta_db()


app.get('/', (req, res) => {
  res.send('JUNA SERVER')
})

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
