const { enviarNotificacao } = require("./notificacao");

function cadastrarUsuario(nome, email, idade) {
  if (!nome || !email) {
    return "Dados obrigatórios";
  }

  if (idade <= 18) {
    return "Usuário deve ser maior de idade";
  }

  if (!email.includes("@")) {
    return "Email inválido";
  }

  const usuario = {
    nome,
    email,
    idade,
    ativo: true
  };

  enviarNotificacao(email, "Cadastro realizado");

  return usuario;
}

function aplicarDesconto(valor) {
  if (valor > 100) {
    return valor * 0.9;
  }
  return valor;
}

function listarUsuarios() {
  return ["Ana", "Bruno", "Carlos", "Diana"];
}

module.exports = {
  cadastrarUsuario,
  aplicarDesconto,
  listarUsuarios
};