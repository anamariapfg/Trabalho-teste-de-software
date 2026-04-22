const produtos = [];

export const produtoService = {
  cadastrarProduto(produto) {
    // validações básicas
    if (produto.preco < 0) {
      throw new Error("Preço não pode ser negativo");
    }

    if (produto.estoque < 0) {
      throw new Error("Estoque não pode ser negativo");
    }

    if (!produto.id || !produto.nome || !produto.categoria) {
      throw new Error("Produto inválido");
    }

    // evita id duplicado
    const produtoExistente = produtos.find((p) => p.id === produto.id);
    if (produtoExistente) {
      throw new Error("Já existe produto com esse ID");
    }

    produtos.push(produto);
    return produto;
  },

  excluirProduto(id) {
    const index = produtos.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error("Produto não encontrado");
    }

    produtos.splice(index, 1);
    return true;
  },

  editarProduto(id, novosDados) {
    const produto = produtos.find((p) => p.id === id);

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    // junta dados antigos com novos
    const produtoAtualizado = { ...produto, ...novosDados };

    if (produtoAtualizado.preco < 0) {
      throw new Error("Preço não pode ser negativo");
    }

    if (produtoAtualizado.estoque < 0) {
      throw new Error("Estoque não pode ser negativo");
    }

    if (!produtoAtualizado.id || !produtoAtualizado.nome || !produtoAtualizado.categoria) {
      throw new Error("Produto inválido");
    }

    // verifica se mudou id para um já existente
    const idDuplicado = produtos.find(
      (p) => p.id === produtoAtualizado.id && p.id !== id
    );

    if (idDuplicado) {
      throw new Error("Já existe produto com esse ID");
    }

    Object.assign(produto, produtoAtualizado);
    return produto;
  },

  listarProdutos() {
    // retorna lista atual
    return produtos;
  },

  buscarProdutoPorId(id) {
    const produto = produtos.find((p) => p.id === id);

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    return produto;
  }
};
