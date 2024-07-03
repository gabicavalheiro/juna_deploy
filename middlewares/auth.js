import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.params.token; // Captura o token da URL
    console.log("Token recebido:", token); // Verifica se o token está sendo recebido corretamente

    if (!token) {
        return res.status(401).json({ msg: 'Token não fornecido' });
    }

    // Verifica o token JWT
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            console.error('Erro na validação do token:', err);
            return res.status(401).json({ msg: 'Token inválido' });
        }
        // Se o token for válido, decodifique-o e adicione ao objeto de requisição (opcional)
        req.user = decoded;
        next(); // Avança para o próximo middleware ou rota
    });
};
