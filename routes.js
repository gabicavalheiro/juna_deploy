import express from 'express';
import cors from 'cors';
import { administradorIndex, administradorCreate, administradorLogin, administradorDestroy } from './controllers/admController.js';

const router = express.Router();

// Configuração do CORS
router.use(cors({
       origin: '*', // URL do seu cliente, ou '*' para aceitar todas as origens
       methods: ['GET', 'POST'], // Métodos HTTP permitidos
       allowedHeaders: ['Content-Type'], // Headers permitidos
       credentials: true, // Permite o envio de credenciais (cookies, por exemplo)
     
     }));;

// Rotas para administradores
router.get('/administradores', administradorIndex);
router.post('/administradores', administradorCreate);
router.post('/administradores/login', administradorLogin);
router.delete('/administradores/:id', administradorDestroy);

export default router;
