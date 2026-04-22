// src/utils/emailService.js

export const emailService = {
  /**
   * Simula o envio de um e-mail de confirmação.
   * No mundo real, aqui haveria uma integração com Nodemailer, SendGrid, etc.
   */
  enviarConfirmacao(emailCliente, numeroPedido) {
    console.log(`[E-mail Enviado] Para: ${emailCliente} | Assunto: Pedido ${numeroPedido} confirmado!`);
    
    // Retornamos true para indicar que o "envio" foi bem-sucedido
    return true;
  },

  /**
   * Simula o envio de um alerta de erro ou cancelamento.
   */
  enviarAlertaErro(emailCliente, mensagem) {
    console.log(`[E-mail de Erro] Para: ${emailCliente} | Mensagem: ${mensagem}`);
    return true;
  }
};