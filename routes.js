// routes.js
import express from 'express';
import jwt from 'jsonwebtoken'
import cors from 'cors';
import { administradorIndex, administradorCreate, administradorDestroy } from './controllers/admController.js';
import { createUser, listUsers } from './controllers/createUser.js';
import { getAllUsersAndAdmins, updateUser, updateUserDetails, userByRole, userEvent, userIndex, usuarioDestroy } from './controllers/userController.js';
import {  login } from './controllers/loginController.js';
import { updateUserImage } from './controllers/imageController.js';
import upload from './utils/multerConfig.js';
import { deleteEvent, eventDay, eventIndex, getEventsByAdminId, getEventsByUserId, handleSave } from './controllers/eventController.js';
import { getUserByEmail, getUserByEmailRoute, getUserProfile } from './controllers/authController.js';
import { createPublicacao, deletePublicacao, getAllPublicacoes, getPublicacoesByUserId, updatePublicacao } from './controllers/publicacaoController.js';
import { createGoal, deleteGoal, getGoalByUserId, goalIndex } from './controllers/metasController.js';

const router = express.Router();

// Configuração do CORS
router.use(cors({
    origin: '*', // Ou configure para a origem específica do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Habilita o envio de credenciais (cookies, por exemplo)
  }));

  
// Rotas públicas
router.post('/login', login);

router.get('/userByEmail/:email', getUserByEmailRoute)

// Rotas protegidas

// Rotas para administradores
router.get('/administradores', administradorIndex);
router.delete('/administradores/:id', administradorDestroy);

// Rotas para clientes
router.delete('/clientes/:id', usuarioDestroy);

router.get('/administradores', administradorIndex);
router.post('/administradores',  administradorCreate);
router.delete('/administradores/:id',  administradorDestroy);

router.post('/usuarios', createUser);
router.get('/usuarios', listUsers);
router.get('/usuarios/:userId', userIndex) 
router.get('/allUsers/:role', userByRole) 
router.get('/allUsers', getAllUsersAndAdmins) 
router.put('/usuarios/:id', updateUser); 
router.put('/updateUserDetails/:userId', updateUserDetails);




router.post('/usuarios/:userId/eventos', handleSave);
router.post('/administradores/:adminId/eventos', handleSave);
router.get('/usuarios/:userId/eventos', getEventsByUserId);
router.get('/administradores/:adminId/eventos', getEventsByAdminId);

router.get('/events', eventIndex)
router.get('/:idType/:id/events/day', eventDay);
router.delete('/events/:id', deleteEvent)


router.post('/publicacoes/:adminId', createPublicacao); 
router.put('/publicacoes/:id', updatePublicacao); 
router.delete('/publicacoes/:id', deletePublicacao); 
router.get('/publicacoes', getAllPublicacoes); 
router.get('/user/:userId/publicacoes', getPublicacoesByUserId); 


router.get('/userProfile', getUserProfile);


router.post('/upload', upload.single('image'), updateUserImage);

router.post('/metas/:adminId', createGoal);
router.get('/metas',  goalIndex)
router.delete('/metas/:id', deleteGoal)
router.get('/usuario/:userId/metas', getGoalByUserId); 


export default router;
