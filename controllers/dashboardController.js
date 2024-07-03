// dashboardController.js

import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';

// Controlador para o dashboard do administrador
export const dashboardAdmin = async (req, res) => {
    const userId = req.params.id;
    // Aqui você pode obter informações específicas do administrador usando o userId, se necessário

    try {
        // Busque informações específicas do administrador usando o userId
        const adminInfo = await Administrador.findByPk(userId);

        // Exemplo de retorno de informações específicas do administrador
        res.status(200).json({ nome: adminInfo.nome, email: adminInfo.email });
    } catch (error) {
        console.error('Erro ao buscar informações do administrador:', error);
        res.status(500).json({ msg: 'Erro ao buscar informações do administrador' });
    }
};

// Controlador para o dashboard do cliente
export const dashboardCliente = async (req, res) => {
    const userId = req.params.id;
    // Aqui você pode obter informações específicas do cliente usando o userId, se necessário

    try {
        // Busque informações específicas do cliente usando o userId
        const clienteInfo = await Usuario.findByPk(userId);

        // Exemplo de retorno de informações específicas do cliente
        res.status(200).json({ nome: clienteInfo.nome, email: clienteInfo.email });
    } catch (error) {
        console.error('Erro ao buscar informações do cliente:', error);
        res.status(500).json({ msg: 'Erro ao buscar informações do cliente' });
    }
};
