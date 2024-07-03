
import bcrypt from 'bcryptjs'
import { Administrador } from '../models/administrador.js'
import { Usuario } from '../models/usuario.js'
import jwt from 'jsonwebtoken'
import { Event } from '../models/event.js'


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

//pega por ID

export const userIndex = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Buscando o usuário
    let user = await Usuario.findByPk(userId, {
      include: Event,
    });

    // Se não encontrou no usuário, busca no administrador
    if (!user) {
      user = await Administrador.findByPk(userId, {
        include: Event,
      });
    }

    if (!user) {
      return res.status(404).send('Usuário ou Administrador não encontrado');
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário ou administrador:', error);
    res.status(500).send('Erro interno ao buscar usuário ou administrador');
  }
};

// Função para buscar todos os usuários e administradores
export const getAllUsersAndAdmins = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      include: [Event],
    });

    const admins = await Administrador.findAll({
      include: [Event],
    });

    const allUsers = [...users, ...admins];

    if (allUsers.length === 0) {
      return res.status(404).send('Nenhum usuário ou administrador encontrado');
    }

    res.json(allUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários e administradores:', error);
    res.status(500).send('Erro interno ao buscar usuários e administradores');
  }
};


export const userByRole = async (req, res) => {
  const { role } = req.params;

  try {
    let users;

    // Verifica se o role é válido
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ msg: 'Role inválida' });
    }

    if (role === 'admin') {
      // Busca administradores
      users = await Administrador.findAll({
        include: [Event],
      });
    } else {
      // Busca usuários
      users = await Usuario.findAll({
        include: [Event],
      });
    }

    if (users.length === 0) {
      return res.status(404).send(`Nenhum ${role} encontrado`);
    }

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro interno ao buscar usuários');
  }
};


export const userEvent = async (req, res) => {

  const userId = req.params.userId;
  const { eventDate, description, tag, time } = req.body;

  const event = await Event.create({ userId, eventDate, description, tag, time });

  res.json(event);
};



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
        res.status(200).json({ id: usuarios.id, nome: usuarios.nome, admin: false, username: usuarios.username, tipo: 'Usuário' });
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


export const getUserTokenById = async (req, res) => {
  const userId = req.params.id;

  try {
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Monta as informações que deseja incluir no token
    const tokenPayload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role // Ajuste conforme a lógica do seu sistema de permissões
    };

    // Gera o token com as informações do usuário
    const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: '1h' });

    // Retorna o token e as informações do usuário como resposta
    return res.status(200).json({ token, usuario });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
  }
};


