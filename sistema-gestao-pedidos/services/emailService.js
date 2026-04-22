export const emailService = {
  enviarConfirmacao(email, numeroPedido) {
    // verifica se o e-mail foi informado
    if (!email) {
      throw new Error("E-mail inválido");
    }

    // verifica se o número do pedido foi informado
    if (numeroPedido === undefined || numeroPedido === null) {
      throw new Error("Número do pedido inválido");
    }

    // simulação simples de envio de e-mail
    // o trabalho não pede integração real com serviço externo
    const mensagem =
      "Pedido confirmado!\n" +
      "Número do pedido: " +
      numeroPedido +
      "\n" +
      "Cliente: " +
      email;

    // mostra no console como se estivesse enviando
    console.log("Enviando e-mail...");
    console.log(mensagem);

    // retorno simples para indicar que deu certo
    return "E-mail enviado para " + email;
  },

  enviarAlertaErro(email, erro) {
    // valida se o e-mail foi informado
    if (!email) {
      throw new Error("E-mail inválido");
    }

    // se não vier erro, coloca uma mensagem padrão
    if (!erro) {
      erro = "Erro não informado";
    }

    // simula aviso de erro
    console.log("Erro no pedido:");
    console.log("Cliente: " + email + " - " + erro);

    // retorno simples
    return "Alerta enviado";
  }
};