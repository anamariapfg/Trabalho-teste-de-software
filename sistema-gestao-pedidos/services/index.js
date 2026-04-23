import { produtoService } from './services/produtoService.js';
import { carrinhoService } from './services/carrinhoService.js';
import { pedidoService } from './services/pedidoService.js';

console.log("=== SISTEMA DE GESTÃO DE PEDIDOS (DEMO) ===");

// 1. Cadastrando um produto para teste
const notebook = produtoService.cadastrarProduto({ 
    id: "p1", 
    nome: "Notebook Gamer", 
    preco: 3000, 
    estoque: 5, 
    categoria: "Eletrônicos" 
});
console.log("✔ Produto cadastrado:", notebook.nome);

// 2. Criando um carrinho e adicionando o produto
let meuCarrinho = [];
carrinhoService.adicionarAoCarrinho(meuCarrinho, notebook, 1);
console.log("✔ Produto adicionado ao carrinho.");

// 3. Fechando o pedido
const cliente = { 
    nome: "Ana Maria", 
    email: "ana@email.com", 
    cep: "70000-000" 
};

try {
    const pedido = pedidoService.fecharPedido(cliente, meuCarrinho, "DESC10");
    console.log("=== PEDIDO FINALIZADO COM SUCESSO ===");
    console.log(pedido);
} catch (erro) {
    console.error("❌ Erro ao fechar pedido:", erro.message);
}
