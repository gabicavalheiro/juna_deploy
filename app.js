import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verifica se o cabeçalho 'Authorization' está presente e contém um token Bearer válido
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Obtém o token do cabeçalho

    // Verifique aqui se o token é válido (por exemplo, compare com uma chave armazenada de forma segura)
    if (token === process.env.SECRET_TOKEN) {
      // Se o token for válido, chame next() para passar para o próximo middleware ou rota
      next();
    } else {
      // Se o token não for válido, retorne um status de não autorizado (403)
      res.status(403).send('Forbidden');
    }
  } else {
    // Se o cabeçalho 'Authorization' não estiver presente, retorne um status de não autorizado (403)
    res.status(403).send('Forbidden');
  }
};

// Aplicando o middleware de autenticação a todas as rotas protegidas
app.use(authenticate);

// Rota protegida de exemplo
app.get('/data', (req, res) => {
  res.json({ message: 'Dados protegidos' });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
