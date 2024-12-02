import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

dotenv.config();

console.log('Client ID:', process.env.INSTAGRAM_CLIENT_ID);
console.log('Client Secret:', process.env.INSTAGRAM_CLIENT_SECRET);

if (!process.env.INSTAGRAM_CLIENT_ID || !process.env.INSTAGRAM_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Variáveis de ambiente não configuradas corretamente' });
}



// Controlador para tratar o redirecionamento do Instagram
export const instagramAuthCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Código de autorização ausente');
    }

    try {
        // Trocar o código de autorização por um token de acesso
        const response = await axios.post('https://api.instagram.com/oauth/access_token', {
            client_id: process.env.INSTAGRAM_CLIENT_ID, // Substitua pela variável de ambiente
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET, // Substitua pela variável de ambiente
            grant_type: 'authorization_code',
            redirect_uri: 'https://junadeploy-production.up.railway.app/auth/instagram/callback', // Certifique-se que coincide com o configurado no Meta Dashboard
            code,
        });

        if (!process.env.INSTAGRAM_CLIENT_ID || !process.env.INSTAGRAM_CLIENT_SECRET) {
            console.error('Variáveis de ambiente INSTAGRAM_CLIENT_ID ou INSTAGRAM_CLIENT_SECRET não configuradas.');
            return res.status(500).send('Erro de configuração no servidor');
        }


        const { access_token, user_id } = response.data;

        console.log('Código de autorização recebido:', code);
        console.log('Enviando solicitação para https://api.instagram.com/oauth/access_token');


        // Responda com o token de acesso e o ID do usuário
        res.status(200).json({ access_token, user_id });
    } catch (error) {
        if (error.response) {
            console.error('Erro na resposta da API do Instagram:', error.response.data);
            res.status(error.response.status).json({
                error: error.response.data.error_message || 'Erro desconhecido na resposta da API do Instagram',
            });
        } else if (error.request) {
            console.error('Erro na solicitação à API do Instagram:', error.request);
            res.status(500).json({ error: 'Erro na solicitação à API do Instagram' });
        } else {
            console.error('Erro inesperado:', error.message);
            res.status(500).json({ error: 'Erro inesperado ao processar o token de acesso' });
        }
    }


};
