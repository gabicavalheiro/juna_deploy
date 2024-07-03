import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';

export const updateUserImage = async (req, res) => {
    const userId = req.body.userId;
    const imageUrl = req.file.path;

    try {
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            const administrador = await Administrador.findByPk(userId);
            if (!administrador) throw new Error('User not found');

            administrador.imageUrl = imageUrl;
            await administrador.save();
        } else {
            usuario.imageUrl = imageUrl;
            await usuario.save();
        }
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        res.status(500).json({ error: error.message });
    }
};
