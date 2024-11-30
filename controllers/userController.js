import bcrypt from 'bcryptjs';
import { Administrador } from '../models/administrador.js';
import { Usuario } from '../models/usuario.js';
import jwt from 'jsonwebtoken';
import { Event } from '../models/event.js';
import { Publicacoes } from '../models/publicacoes.js';
import { Meta } from '../models/meta.js';
import { Project } from '../models/projeto.js';

// Validações de senha
function validaSenha(senha) {
  const mensagem = [];

  if (senha.length < 8) {
    mensagem.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
  }

  let pequenas = 0;
  let grandes = 0;
  let numeros = 0;
  let simbolos = 0;

  for (const letra of senha) {
    if (/[a-z]/.test(letra)) pequenas++;
    else if (/[A-Z]/.test(letra)) grandes++;
    else if (/[0-9]/.test(letra)) numeros++;
    else simbolos++;
  }

  if (pequenas === 0 || grandes === 0 || numeros === 0 || simbolos === 0) {
    mensagem.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos");
  }

  return mensagem;
}

export const userIndex = async (req, res) => {
  const userId = req.params.userId;

  try {
    let user = await Usuario.findByPk(userId, {
      include: [
        { model: Event, as: 'eventos' },
        { model: Publicacoes, as: 'publicacoes' },
        { model: Meta, as: 'metas' },
        { model: Project, as: 'projetos' } // Alias correto
      ]
    });

    if (!user) {
      user = await Administrador.findByPk(userId, {
        include: [
          { model: Event, as: 'adminEvents' },
          { model: Publicacoes, as: 'publicacoesAdmin' },
          { model: Meta, as: 'metasAdmin' },
          { model: Project, as: 'projetosAdmin' } // Alias correto
        ]
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



// Atualizar usuário
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { nome, email, senha, imagemPerfil } = req.body;

  try {
    let usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      usuario = await Administrador.findByPk(userId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
    }

    // Validação de senha se fornecida
    if (senha) {
      const validacaoSenha = validaSenha(senha);
      if (validacaoSenha.length > 0) {
        return res.status(400).json({ erros: validacaoSenha });
      }
      const salt = bcrypt.genSaltSync(12);
      usuario.senha = bcrypt.hashSync(senha, salt);
    }

    // Atualizar outros campos somente se fornecidos
    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (imagemPerfil) usuario.imagemPerfil = imagemPerfil;

    await usuario.save();

    res.status(200).json({ msg: "Usuário atualizado com sucesso", usuario });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ erro: "Erro ao atualizar usuário", detalhes: error });
  }
};




export const getAllUsersAndAdmins = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      include: [
        { model: Event, as: 'eventos' },
        { model: Publicacoes, as: 'publicacoes' },
        { model: Meta, as: 'metas' },
        { model: Project, as: 'projetos' } // Alias correto
      ]
    });

    const admins = await Administrador.findAll({
      include: [
        { model: Event, as: 'adminEvents' },
        { model: Publicacoes, as: 'publicacoesAdmin' },
        { model: Meta, as: 'metasAdmin' },
        { model: Project, as: 'projetosAdmin' } // Alias correto
      ]
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


// Buscar usuários por papel (role)
export const userByRole = async (req, res) => {
  const { role } = req.params;

  try {
    let users;

    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ msg: 'Role inválida' });
    }

    if (role === 'admin') {
      users = await Administrador.findAll({
        include: [
          { model: Event, as: 'adminEvents' },
          { model: Publicacoes, as: 'publicacoesAdmin' },
          { model: Meta, as: 'metasAdmin' },
          { model: Project, as: 'projetosAdmin' } // Alias correto
        ]
      });
    } else {
      users = await Usuario.findAll({
        include: [
          { model: Event, as: 'eventos' },
          { model: Publicacoes, as: 'publicacoes' },
          { model: Meta, as: 'metas' },
          { model: Project, as: 'projetos' } // Alias correto
        ]
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



// Criar evento para o usuário
export const userEvent = async (req, res) => {
  const userId = req.params.userId;
  const { eventDate, description, tag, time } = req.body;

  try {
    const event = await Event.create({ userId, eventDate, description, tag, time });
    res.json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).send('Erro ao criar evento');
  }
};

// Função de login
export const usuarioLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ erro: 'Login ou senha incorreto' });
    }

    if (bcrypt.compareSync(senha, usuario.senha)) {
      const response = {
        id: usuario.id,
        nome: usuario.nome,
        admin: usuario.admin,
        tipo: usuario.admin ? 'Adm' : 'Usuário'
      };
      res.status(200).json(response);
    } else {
      res.status(401).json({ erro: 'Login ou senha incorreto' });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).send('Erro interno ao fazer login');
  }
};

// Função para excluir usuário
export const usuarioDestroy = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    await usuario.destroy();
    res.status(200).json({ msg: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(400).json({ erro: "Erro ao excluir usuário", detalhes: error });
  }
};

// Rota para obter token do usuário por ID
export const getUserTokenById = async (req, res) => {
  const userId = req.params.id;

  try {
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const tokenPayload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role // Ajuste conforme a lógica do seu sistema de permissões
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token, usuario });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
  }
};


// Função para adicionar informações adicionais e alterar dados do usuário
export const updateUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const { descricao, username, nome, email, senha, imagemPerfil } = req.body;

  try {
    let usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      usuario = await Administrador.findByPk(userId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
    }

    // Adicionar a descrição ao usuário, se fornecida
    if (descricao) {
      usuario.descricao = descricao;
    }

    // Atualizar username, nome, email, imagem de perfil, se fornecidos
    if (username) {
      usuario.username = username;
    }
    if (nome) {
      usuario.nome = nome;
    }
    if (email) {
      usuario.email = email;
    }
    if (imagemPerfil) {
      usuario.imagemPerfil = imagemPerfil;
    }

    // Validar e atualizar senha, se fornecida
    if (senha) {
      const validacaoSenha = validaSenha(senha);
      if (validacaoSenha.length > 0) {
        return res.status(400).json({ erros: validacaoSenha });
      }
      const salt = bcrypt.genSaltSync(12);
      usuario.senha = bcrypt.hashSync(senha, salt);
    }

    await usuario.save();

    res.status(200).json({ msg: "Informações do usuário atualizadas com sucesso", usuario });
  } catch (error) {
    console.error('Erro ao atualizar informações do usuário:', error);
    res.status(500).json({ erro: "Erro ao atualizar informações do usuário", detalhes: error });
  }
};
