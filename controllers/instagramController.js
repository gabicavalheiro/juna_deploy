import axios from 'axios';

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
        console.log('Código recebido:', req.query.code);
        console.log('Client ID:', process.env.INSTAGRAM_CLIENT_ID);
        console.log('Client Secret:', process.env.INSTAGRAM_CLIENT_SECRET);


        const { access_token, user_id } = response.data;

        // Responda com o token de acesso e o ID do usuário
        res.status(200).json({ access_token, user_id });
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao obter o token de acesso');
      }
      
};
