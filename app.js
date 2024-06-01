import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === `Bearer ${process.env.SECRET_TOKEN}`) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

app.use(authenticate);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
