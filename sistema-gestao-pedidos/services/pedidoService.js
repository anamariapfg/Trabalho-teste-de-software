import { carrinhoService } from "./carrinhoService.js";
import { emailService } from "./emailService.js";

export const pedidoService = {
  aplicarCupom(valorTotal, cupom) {
    // se não tiver cupom, retorna normal
    if (!cupom) {
      return valorTotal;
    }

    if (cupom === "DESC10") {
      return valorTotal * 0.9;
    }

    if (cupom === "DESC20") {
      return valorTotal * 0.8;
    }

    // cupom inválido
    throw new Error("Cupom inválido");
  },

  calcularFrete(cep, valorCompra) {
    // frete grátis acima de 200
    if (valorCompra >= 200) {
      return 0;
    }

    return 20;
  },

  fecharPedido(cliente, carrinho, cupom) {
    // não pode fechar com carrinho vazio
    if (carrinho.length === 0) {
      throw new Error("Carrinho vazio");
    }

    // valida cliente básico
    if (!cliente || !cliente.nome || !cliente.email || !cliente.cep) {
      throw new Error("Cliente inválido");
    }

    const subtotal = carrinhoService.calcularSubtotal(carrinho);

    const totalComDesconto = this.aplicarCupom(subtotal, cupom);

    const frete = this.calcularFrete(cliente.cep, totalComDesconto);

    const totalFinal = totalComDesconto + frete;

    const numeroPedido = Math.floor(Math.random() * 1000);

    // simula envio de confirmação
    emailService.enviarConfirmacao(cliente.email, numeroPedido);

    return {
      cliente: cliente.nome,
      email: cliente.email,
      itens: carrinho,
      subtotal,
      frete,
      totalFinal,
      data: new Date()
    };
  }
};
