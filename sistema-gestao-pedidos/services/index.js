import { produtoService } from './produtoService.js';
import { carrinhoService } from './carrinhoService.js';
import { pedidoService } from './pedidoService.js';

console.log("\n================================================");
console.log("   SISTEMA DE GESTÃO DE PEDIDOS - DEMO AT2");
console.log("================================================\n");

// 1. LISTAGEM DE PRODUTOS
console.log("--- 1. CONSULTANDO ESTOQUE INICIAL ---");
const produtosIniciais = [
    { id: "p1", nome: "Notebook Gamer", preco: 3000, estoque: 5, categoria: "Eletrônicos" },
    { id: "p2", nome: "Mouse Sem Fio", preco: 150, estoque: 10, categoria: "Acessórios" },
    { id: "p3", nome: "Monitor 24'", preco: 900, estoque: 3, categoria: "Eletrônicos" }
];

produtosIniciais.forEach(p => {
    produtoService.cadastrarProduto(p);
    console.log(`[ESTOQUE] ID: ${p.id} | ${p.nome.padEnd(15)} | R$ ${p.preco} | Qtd: ${p.estoque}`);
});

// 2. AÇÕES NO CARRINHO
console.log("\n--- 2. GERENCIANDO CARRINHO ---");
let meuCarrinho = [];
// CORREÇÃO AQUI: Nome da função conforme o padrão do seu projeto
const item1 = produtoService.buscarProdutoPorId("p1"); 

carrinhoService.adicionarAoCarrinho(meuCarrinho, item1, 1);
console.log(`✔ Adicionado ao carrinho: 1x ${item1.nome}`);

const subtotal = carrinhoService.calcularSubtotal(meuCarrinho);
console.log(`✔ Subtotal atual: R$ ${subtotal}`);

// 3. CÁLCULOS E FINALIZAÇÃO
console.log("\n--- 3. PROCESSANDO PAGAMENTO E FRETE ---");
const cliente = { 
    nome: "Ana Maria", 
    email: "ana@email.com", 
    cep: "70000-000" 
};

try {
    const pedido = pedidoService.fecharPedido(cliente, meuCarrinho, "DESC10");
    
    console.log("\n================================================");
    console.log("       PEDIDO FINALIZADO COM SUCESSO");
    console.log("================================================");
    console.log(`ID do Pedido: #${pedido.id}`);
    console.log(`Cliente: ${cliente.nome}`);
    console.log(`E-mail de Confirmação: ${pedido.cliente}`); 
    console.log(`Valor Total Final: R$ ${pedido.total}`);
    console.log(`Estoque atualizado: ${item1.estoque} unidades restantes.`);
    console.log("================================================\n");
    
} catch (erro) {
    console.error("\n❌ Erro ao fechar pedido:", erro.message);
}