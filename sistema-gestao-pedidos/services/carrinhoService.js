export const carrinhoService = {
  adicionarAoCarrinho(carrinho, produto, quantidade) {
    if (produto.estoque < quantidade) {
      throw new Error("Estoque insuficiente");
    }
    
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      carrinho.push({ ...produto, quantidade });
    }
    return carrinho;
  },

  removerDoCarrinho(carrinho, idProduto) {
    const index = carrinho.findIndex(item => item.id === idProduto);
    if (index !== -1) {
      carrinho.splice(index, 1);
    }
    return carrinho;
  },

  calcularSubtotal(carrinho) {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }
};