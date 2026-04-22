function enviarNotificacao(email, mensagem) {
  return `Enviado para ${email}: ${mensagem}`;
}

module.exports = { enviarNotificacao };