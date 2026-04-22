// 1. Imports sempre no topo do arquivo
import { carrinhoService } from './carrinhoService.js';
import { emailService } from '../utils/emailService.js';

// 2. Simulação de API externa (mantida aqui como constante)
export const freteExternoAPI = {
  buscarValor: (cep) => 25.00 
};

// 3. Exportação do objeto principal com todas as funções dentro
export const pedidoService = {
  
  aplicarCupom(valorTotal, cupom) {
    const cuponsValidos = {
      'DESC10': 0.10,
      'DESC20': 0.20
    };

    if (!cuponsValidos[cupom]) throw new Error("Cupom inválido");
    
    return valorTotal * (1 - cuponsValidos[cupom]);
  },

  calcularFrete(cep, valorCompra) {
    // Regra de Negócio: Frete grátis acima de 200 reais
    if (valorCompra > 200) return 0; 
    return freteExternoAPI.buscarValor(cep);
  },

  fecharPedido(cliente, carrinho, cupom = null) {
    // Validação obrigatória: Carrinho vazio
    if (carrinho.length === 0) throw new Error("Carrinho vazio");

    let total = carrinhoService.calcularSubtotal(carrinho);

    // Aplica cupom se ele existir
    if (cupom) {
      total = this.aplicarCupom(total, cupom);
    }

    const valorFrete = this.calcularFrete(cliente.cep, total);
    const totalComFrete = total + valorFrete;

    const pedidoRealizado = {
      cliente: cliente.nome,
      email: cliente.email,
      itens: carrinho.length,
      subtotal: total,
      frete: valorFrete,
      totalFinal: totalComFrete,
      data: new Date().toISOString()
    };

    // Chamada do serviço que será MOCKADO no Jest
    emailService.enviarConfirmacao(cliente.email, Math.floor(Math.random() * 1000));

    return pedidoRealizado;
  }
};