// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();


// export const sequelize = new Sequelize( process.env.DB_DB,  process.env.DB_USER,  process.env.DB_PASSWORD, {
//   host:  process.env.DB_HOST,
//   dialect: 'mysql', // ou 'postgres', 'sqlite', 'mssql', etc., dependendo do seu banco de dados
// });


// sequelize.authenticate()
//   .then(() => {
//     console.log('Conexão bem-sucedida com o banco de dados.');
//   })
//   .catch(err => {
//     console.error('Erro ao conectar ao banco de dados:', err);
//   });


//   sequelize.query('SELECT * FROM administradores')
//   .then(rows => {
//     console.log('Dados recuperados do banco de dados:', rows);
//   })
//   .catch(err => {
//     console.error('Erro ao executar a consulta:', err);
//   });





// export default sequelize;
