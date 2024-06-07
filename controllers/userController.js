
import bcrypt from 'bcryptjs'
import { Administrador } from '../models/administrador.js'
import { Usuario } from '../models/usuario.js'


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
  
  export const userIndex = async (req, res) => {
  
    try {
      const usuarios = await Usuario.findAll();
      res.status(200).json(usuarios)
    } catch (error) {
      res.status(400).send(error)
    }
  }
  



  export const usuarioLogin = async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const usuarios = await Usuario.findOne({ where: { email } });
  
      if (!usuarios) {
        res.status(400).json({ erro: 'Login ou senha incorreto' });
        return;
      }
  
      if (bcrypt.compareSync(senha, usuarios.senha)) {
        if (usuarios.admin) {
          // Se o usuário for administrador
          res.status(200).json({ id: usuarios.id, nome: usuarios.nome, admin: true, tipo: 'Adm' });
        } else {
          // Se o usuário for um usuário comum
          res.status(200).json({ id: usuarios.id, nome: usuarios.nome, admin: false, tipo: 'Usuário' });
        }
      } else {
        res.status(401).json({ erro: 'Login ou senha incorreto' });
      }
      
    } catch (error) {
      res.status(400).send(error);
    }
  };

  // Middleware de autorização de administrador

// Função para excluir administrador por id
export const usuarioDestroy = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: "usuario não encontrado" });
    }

    await usuario.destroy();

    res.status(200).json({ msg: "Usuario excluído com sucesso" });

  } catch (error) {
    res.status(400).json({ erro: "Erro ao excluir Usuario", detalhes: error });
  }
};

// Rota para excluir administrador, com middleware de autorização de administrador


  
 