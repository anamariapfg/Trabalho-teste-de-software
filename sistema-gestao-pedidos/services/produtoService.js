const produtos = [];

export const produtoService = {
  cadastrarProduto(produto) {
    if (produto.preco < 0) throw new Error("Preço não pode ser negativo");
    if (produto.estoque < 0) throw new Error("Estoque não pode ser negativo");
    
    produtos.push(produto);
    return produto;
  },

  excluirProduto(id) {
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado");
    produtos.splice(index, 1);
    return true;
  },

  editarProduto(id, novosDados) {
    const produto = this.buscarProdutoPorId(id);
    if (novosDados.preco < 0 || novosDados.estoque < 0) {
      throw new Error("Valores negativos não são permitidos");
    }
    Object.assign(produto, novosDados);
    return produto;
  },

  listarProdutos() {
    return produtos;
  },

  buscarProdutoPorId(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) throw new Error("Produto não encontrado");
    return produto;
  },

  // Helper para os testes limparem o array entre execuções
  limparProdutos() {
    produtos.length = 0;
  }
};