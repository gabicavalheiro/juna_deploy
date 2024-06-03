import { Router } from "express";
import { administradorCreate, administradorDestroy, administradorIndex, administradorLogin } from "./controllers/admController.js";

const router = Router()

router .get('/Administradores', administradorIndex)
       .post('/Administradores', administradorCreate)
       .post('/Login', administradorLogin)
       .delete('/Administradores/:id',  administradorDestroy);

export default router;