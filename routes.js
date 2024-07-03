// routes.js
import express from 'express';
import jwt from 'jsonwebtoken'
import cors from 'cors';
import { administradorIndex, administradorCreate, administradorLogin, administradorDestroy } from './controllers/admController.js';
import { createUser, listUsers, getUserTokenById, updateUser } from './controllers/createUser.js';
import { getAllUsersAndAdmins, userByRole, userEvent, userIndex, usuarioDestroy, usuarioLogin } from './controllers/userController.js';
import { getDataFromTokenAndId, login } from './controllers/loginController.js';
import { updateUserImage } from './controllers/imageController.js';
import upload from './utils/multerConfig.js';
import {  verifyToken } from './middlewares/auth.js';
import { dashboardAdmin, dashboardCliente } from './controllers/dashboardController.js';
import { deleteEvent, eventDay, eventIndex, getEventsByUserId, handleSave } from './controllers/eventController.js';
import { getUserByEmail, getUserByEmailRoute, getUserProfile, handleLogin } from './controllers/authController.js';

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
router.post('/administradores/login', administradorLogin);
router.delete('/administradores/:id', administradorDestroy);

// Rotas para clientes
router.get('/clientes', userIndex);
router.post('/clientes/login', usuarioLogin);
router.delete('/clientes/:id', usuarioDestroy);

router.get('/administradores', administradorIndex);
router.post('/administradores',  administradorCreate);
router.delete('/administradores/:id',  administradorDestroy);

router.post('/usuarios', createUser);
router.get('/usuarios', listUsers);
router.put('/usuarios/:id', updateUser);
router.get('/usuarios/:userId', userIndex) //admin + user por ID
router.get('/allUsers/:role', userByRole) // admin + user por ROLE
router.get('/allUsers', getAllUsersAndAdmins) // admin + user



router.post('/allUsers/:userId/events', handleSave);
router.get('/allUsers/:userId/events', getEventsByUserId);
router.get('/events', eventIndex)
router.get('/eventsDay', eventDay)
router.delete('/events/:id', deleteEvent)




router.post('/login', handleLogin);
router.get('/userProfile', getUserProfile);


router.post('/upload', upload.single('image'), updateUserImage);




export default router;
