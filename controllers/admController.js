
import bcrypt from 'bcryptjs'
import { Administrador } from '../models/administrador.js'


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
  
  export const administradorIndex = async (req, res) => {
  
    try {
      const administradores = await Administrador.findAll();
      res.status(200).json(administradores)
    } catch (error) {
      res.status(400).send(error)
    }
  }
  
  export const administradorCreate = async (req, res) => {
    const { nome, email, senha, admin } = req.body
  
   
    if (!nome || !email || !senha || !admin ) {
      res.status(400).json({ id: 0, msg: "Erro... Informe os dados" })
      console.error(error)
      return
    }
  
    const mensagemValidacao = validaSenha(senha)
    if (mensagemValidacao.length >= 1) {
      res.status(400).json({ id: 0, msg: mensagemValidacao })
      return
    }
  
  try {
  const administradores = await Administrador.create({
    nome, email, senha, admin
  });
  res.status(201).json(administradores);
} catch (error) {
  console.error('Erro ao criar administrador:', error);
  res.status(400).send("Erro ao criar administrador");
}
  }





  export const administradorLogin = async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const administradores = await Administrador.findOne({ where: { email } });
  
      if (!administradores) {
        res.status(400).json({ erro: 'Login ou senha incorreto' });
        return;
      }
  
      if (bcrypt.compareSync(senha, administradores.senha)) {
        if (administradores.admin) {
          // Se o usuário for administrador
          res.status(200).json({ id: administradores.id, nome: administradores.nome, admin: true, tipo: 'Adm' });
        } else {
          // Se o usuário for um usuário comum
          res.status(200).json({ id: administradores.id, nome: administradores.nome, admin: false, tipo: 'Usuário' });
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
export const administradorDestroy = async (req, res) => {
  const { id } = req.params;

  try {
    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({ erro: "Administrador não encontrado" });
    }

    await administrador.destroy();

    res.status(200).json({ msg: "Administrador excluído com sucesso" });

  } catch (error) {
    res.status(400).json({ erro: "Erro ao excluir administrador", detalhes: error });
  }
};

// Rota para excluir administrador, com middleware de autorização de administrador


  
 