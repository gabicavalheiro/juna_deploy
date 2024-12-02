import axios from 'axios';
import qs from 'qs'; // Adicionar o pacote qs para formatar o corpo da requisição
import dotenv from 'dotenv';

dotenv.config();

// Controlador para tratar o redirecionamento do Instagram
export const instagramAuthCallback = async (req, res) => {
    const { code } = req.query;

    console.log('Recebendo código:', code);
    console.log('Client ID:', process.env.INSTAGRAM_CLIENT_ID);
    console.log('Client Secret:', process.env.INSTAGRAM_CLIENT_SECRET);
    console.log('Redirect URI:', 'https://junadeploy-production.up.railway.app/auth/instagram/callback');

    // Verifique se as variáveis de ambiente estão configuradas corretamente
    if (!process.env.INSTAGRAM_CLIENT_ID || !process.env.INSTAGRAM_CLIENT_SECRET) {
        return res.status(500).json({ error: 'Variáveis de ambiente não configuradas corretamente' });
    }

    if (!code) {
        return res.status(400).send('Código de autorização ausente');
    }

    try {
        // Trocar o código de autorização por um token de acesso
        const response = await axios.post('https://api.instagram.com/oauth/access_token', 
            qs.stringify({
                client_id: process.env.INSTAGRAM_CLIENT_ID,
                client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
                grant_type: process.env.AUTHORIZATHION_CODE,
                redirect_uri: 'https://junadeploy-production.up.railway.app/auth/instagram/callback', // Certifique-se que coincide com o configurado no Meta Dashboard
                code,
            }),
            {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, user_id } = response.data;

        // Responda com o token de acesso e o ID do usuário
        res.status(200).json({ access_token, user_id });
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao obter o token de acesso');
    }
};
