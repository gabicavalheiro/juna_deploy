// routes.js
import express from 'express';
import jwt from 'jsonwebtoken'
import cors from 'cors';
import { administradorIndex, administradorCreate, administradorDestroy } from './controllers/admController.js';
import { createUser, listUsers } from './controllers/createUser.js';
import { getAllUsersAndAdmins, userByRole, userEvent, userIndex, usuarioDestroy } from './controllers/userController.js';
import {  login } from './controllers/loginController.js';
import { updateUserImage } from './controllers/imageController.js';
import upload from './utils/multerConfig.js';
import { deleteEvent, eventDay, eventIndex, getEventsByUserId, handleSave } from './controllers/eventController.js';
import { getUserByEmail, getUserByEmailRoute, getUserProfile } from './controllers/authController.js';
import { createPublicacao, deletePublicacao, getAllPublicacoes, getPublicacoesByUserId, updatePublicacao } from './controllers/publicacaoController.js';

const router = express.Router();

// Configuração do CORS
router.use(cors({
    origin: '*', // URL do seu cliente, ou '*' para aceitar todas as origens
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true, // Permite o envio de credenciais (cookies, por exemplo)
}));

// Rotas públicas
router.post('/login', login);

router.get('/userByEmail/:email', getUserByEmailRoute)

// Rotas protegidas

// Rotas para administradores
router.get('/administradores', administradorIndex);
router.delete('/administradores/:id', administradorDestroy);

// Rotas para clientes
router.get('/clientes', userIndex);
router.delete('/clientes/:id', usuarioDestroy);

router.get('/administradores', administradorIndex);
router.post('/administradores',  administradorCreate);
router.delete('/administradores/:id',  administradorDestroy);

router.post('/usuarios', createUser);
router.get('/usuarios', listUsers);
router.get('/usuarios/:userId', userIndex) //admin + user por ID
router.get('/allUsers/:role', userByRole) // admin + user por ROLE
router.get('/allUsers', getAllUsersAndAdmins) // admin + user



router.post('/allUsers/:userId/events', handleSave);
router.get('/allUsers/:userId/events', getEventsByUserId);
router.get('/events', eventIndex)
router.get('/allUsers/:userId/events/today', eventDay);
router.delete('/events/:id', deleteEvent)


router.post('/publicacoes/:adminId', createPublicacao); 
router.put('/publicacoes/:id', updatePublicacao); 
router.delete('/publicacoes/:id', deletePublicacao); 
router.get('/publicacoes', getAllPublicacoes); 
router.get('/user/:userId/publicacoes', getPublicacoesByUserId); // Buscar publicações por ID do usuário


router.get('/userProfile', getUserProfile);


router.post('/upload', upload.single('image'), updateUserImage);




export default router;
