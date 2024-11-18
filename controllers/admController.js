import bcrypt from "bcrypt";
import { Administrador } from "../models/administrador.js";

// Função para validar senha
function validaSenha(senha) {
  const mensagem = [];

  if (senha.length < 8) {
    mensagem.push("Erro... A senha deve possuir, no mínimo, 8 caracteres");
  }

  // Contadores
  let pequenas = 0, grandes = 0, numeros = 0, simbolos = 0;

  // Verifica os caracteres da senha
  for (const letra of senha) {
    if (/[a-z]/.test(letra)) pequenas++;
    else if (/[A-Z]/.test(letra)) grandes++;
    else if (/[0-9]/.test(letra)) numeros++;
    else simbolos++;
  }

  if (pequenas === 0 || grandes === 0 || numeros === 0 || simbolos === 0) {
    mensagem.push(
      "Erro... A senha deve conter letras minúsculas, maiúsculas, números e símbolos"
    );
  }

  return mensagem;
}

// Listar todos os administradores
export const administradorIndex = async (req, res) => {
  try {
    const administradores = await Administrador.findAll();
    res.status(200).json(administradores);
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    res.status(400).json({ erro: "Erro ao listar administradores" });
  }
};

// Criar novo administrador
export const administradorCreate = async (req, res) => {
  const { nome, email, senha, role } = req.body;

  if (!nome || !email || !senha || !role) {
    res.status(400).json({ id: 0, msg: "Erro... Informe todos os dados" });
    return;
  }

  // Validação da senha
  const mensagemValidacao = validaSenha(senha);
  if (mensagemValidacao.length > 0) {
    res.status(400).json({ id: 0, msg: mensagemValidacao });
    return;
  }

  try {
    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Cria o administrador no banco
    const administrador = await Administrador.create({
      nome,
      email,
      senha: senhaHash,
      role,
    });

    res.status(201).json(administrador);
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    res.status(400).json({ erro: "Erro ao criar administrador" });
  }
};

// Excluir administrador por ID
export const administradorDestroy = async (req, res) => {
  const { id } = req.params;

  try {
    const administrador = await Administrador.findByPk(id);

    if (!administrador) {
      res.status(404).json({ erro: "Administrador não encontrado" });
      return;
    }

    await administrador.destroy();
    res.status(200).json({ msg: "Administrador excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir administrador:", error);
    res.status(400).json({ erro: "Erro ao excluir administrador" });
  }
};
