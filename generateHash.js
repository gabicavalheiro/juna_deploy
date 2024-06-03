import bcrypt from 'bcryptjs';

const senha = 'sua_senha';
const saltRounds = 10;

bcrypt.hash(senha, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hash da senha:', hash);
});
