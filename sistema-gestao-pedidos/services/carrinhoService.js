export const carrinhoService = {
  adicionarAoCarrinho(carrinho, produto, quantidade) {
    // verifica se tem estoque
    if (produto.estoque <= 0) {
      throw new Error("Produto sem estoque");
    }

    // quantidade inválida
    if (quantidade <= 0) {
      throw new Error("Quantidade inválida");
    }

    const itemExistente = carrinho.find((item) => item.id === produto.id);

    if (itemExistente) {
      // soma com o que já tem no carrinho
      if (itemExistente.quantidade + quantidade > produto.estoque) {
        throw new Error("Estoque insuficiente");
      }

      itemExistente.quantidade += quantidade;
    } else {
      if (quantidade > produto.estoque) {
        throw new Error("Estoque insuficiente");
      }

      carrinho.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade
      });
    }

    return carrinho;
  },

  removerDoCarrinho(carrinho, idProduto) {
    const index = carrinho.findIndex((item) => item.id === idProduto);

    if (index === -1) {
      throw new Error("Produto não encontrado no carrinho");
    }

    carrinho.splice(index, 1);
    return carrinho;
  },

  calcularSubtotal(carrinho) {
    // soma dos itens
    return carrinho.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  }
};

