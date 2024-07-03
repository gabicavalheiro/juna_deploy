import bcrypt from 'bcryptjs';

const senhaOriginal = 'Gabriele123**';

// Gerar o hash da senha original
bcrypt.hash(senhaOriginal, 12, (err, hash) => {
    if (err) {
        console.error('Erro ao gerar hash:', err);
    } else {
        console.log('Senha original:', senhaOriginal);
        console.log('Hash gerado:', hash);

        // Comparar a senha original com o hash gerado
        bcrypt.compare(senhaOriginal, hash, (err, isMatch1) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
            } else {
                console.log('Comparação 1:', isMatch1);
                
                // Agora vamos comparar outra senha original com o mesmo hash
                const outraSenhaOriginal = 'OutraSenha123**';
                bcrypt.compare(outraSenhaOriginal, hash, (err, isMatch2) => {
                    if (err) {
                        console.error('Erro ao comparar senhas:', err);
                    } else {
                        console.log('Outra senha original:', outraSenhaOriginal);
                        console.log('Comparação 2:', isMatch2);
                    }
                });
            }
        });
    }
});
