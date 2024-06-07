import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuario.js';
import { Administrador } from '../models/administrador.js';



function validaSenha(senha) {

    const mensagem = []
  
    // .length: retorna o tamanho da string (da senha)
    if (senha.length < 8) {
      mensagem.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
    }
  
    // contadores
    let pequenas = 0
    let grandes = 0
    let numeros = 0
    let simbolos = 0
  
    
  
    // percorre as letras da variável senha
    for (const letra of senha) {
      // expressão regular
      if ((/[a-z]/).test(letra)) {
        pequenas++
      }
      else if ((/[A-Z]/).test(letra)) {
        grandes++
      }
      else if ((/[0-9]/).test(letra)) {
        numeros++
      } else {
        simbolos++
      }
    }
  
    if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
      mensagem.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
    }
  
    return mensagem
  }
  
export const createUser = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha || !role) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
    }

    const mensagemValidacao = validaSenha(senha)
    if (mensagemValidacao.length >= 1) {
      res.status(400).json({ id: 0, msg: mensagemValidacao })
      return
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    try {
        let user;

        if (role === 'admin') {
            user = await Administrador.create({ nome, email, senha: senhaHash, role });
        } else if (role === 'user') {
            user = await Usuario.create({ nome, email, senha: senhaHash, role });
        } else {
            return res.status(400).json({ msg: 'Role inválida' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ msg: 'Erro ao criar usuário' });
    }
};