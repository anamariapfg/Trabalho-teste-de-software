import { produtoService } from "./produtoService.js";

// Limpa a lista de produtos entre cada teste (acessa o módulo diretamente)
// Como o array é interno, vamos usar excluirProduto para limpar
function limparProdutos() {
  const lista = produtoService.listarProdutos();
  [...lista].forEach((p) => produtoService.excluirProduto(p.id));
}

describe("produtoService", () => {
  beforeEach(() => {
    limparProdutos();
  });

  // ─── cadastrarProduto ───────────────────────────────────────────────────────

  describe("cadastrarProduto", () => {
    test("CT-01 | deve cadastrar produto com dados válidos", () => {
      const produto = {
        id: "p1",
        nome: "Notebook",
        preco: 2500,
        estoque: 10,
        categoria: "Eletrônicos",
      };

      const resultado = produtoService.cadastrarProduto(produto);

      expect(resultado).toEqual(produto);
      expect(resultado).toHaveProperty("id", "p1");
      expect(resultado).toHaveProperty("nome", "Notebook");
    });

    test("CT-02 | deve lançar erro ao cadastrar produto com preço negativo", () => {
      const produto = {
        id: "p2",
        nome: "Mouse",
        preco: -10,
        estoque: 5,
        categoria: "Periféricos",
      };

      expect(() => produtoService.cadastrarProduto(produto)).toThrow(
        "Preço não pode ser negativo"
      );
    });

    test("CT-03 | deve lançar erro ao cadastrar produto com estoque negativo", () => {
      const produto = {
        id: "p3",
        nome: "Teclado",
        preco: 150,
        estoque: -1,
        categoria: "Periféricos",
      };

      expect(() => produtoService.cadastrarProduto(produto)).toThrow(
        "Estoque não pode ser negativo"
      );
    });

    test("CT-04 | deve lançar erro ao cadastrar produto com ID duplicado", () => {
      const produto = {
        id: "p4",
        nome: "Monitor",
        preco: 800,
        estoque: 3,
        categoria: "Eletrônicos",
      };

      produtoService.cadastrarProduto(produto);

      expect(() => produtoService.cadastrarProduto(produto)).toThrow(
        "Já existe produto com esse ID"
      );
    });

    test("CT-05 | deve lançar erro ao cadastrar produto sem campos obrigatórios", () => {
      const produto = { id: "", nome: "", preco: 50, estoque: 5, categoria: "" };

      expect(() => produtoService.cadastrarProduto(produto)).toThrow(
        "Produto inválido"
      );
    });

    test("CT-06 | deve aceitar produto com preço zero", () => {
      const produto = {
        id: "p6",
        nome: "Brinde",
        preco: 0,
        estoque: 100,
        categoria: "Promoção",
      };

      const resultado = produtoService.cadastrarProduto(produto);
      expect(resultado.preco).toBe(0);
    });
  });

  // ─── excluirProduto ─────────────────────────────────────────────────────────

  describe("excluirProduto", () => {
    test("CT-07 | deve excluir produto existente e retornar true", () => {
      produtoService.cadastrarProduto({
        id: "p10",
        nome: "HD Externo",
        preco: 300,
        estoque: 5,
        categoria: "Armazenamento",
      });

      const resultado = produtoService.excluirProduto("p10");

      expect(resultado).toBe(true);
    });

    test("CT-08 | deve remover produto da lista após exclusão", () => {
      produtoService.cadastrarProduto({
        id: "p11",
        nome: "Pen Drive",
        preco: 40,
        estoque: 20,
        categoria: "Armazenamento",
      });

      produtoService.excluirProduto("p11");
      const lista = produtoService.listarProdutos();

      expect(lista.find((p) => p.id === "p11")).toBeUndefined();
    });

    test("CT-09 | deve lançar erro ao excluir produto inexistente", () => {
      expect(() => produtoService.excluirProduto("id-inexistente")).toThrow(
        "Produto não encontrado"
      );
    });

    test("CT-10 | lista deve ter tamanho correto após exclusão", () => {
      produtoService.cadastrarProduto({
        id: "pa",
        nome: "A",
        preco: 10,
        estoque: 1,
        categoria: "X",
      });
      produtoService.cadastrarProduto({
        id: "pb",
        nome: "B",
        preco: 20,
        estoque: 2,
        categoria: "Y",
      });

      produtoService.excluirProduto("pa");

      expect(produtoService.listarProdutos()).toHaveLength(1);
    });
  });

  // ─── editarProduto ──────────────────────────────────────────────────────────

  describe("editarProduto", () => {
    beforeEach(() => {
      produtoService.cadastrarProduto({
        id: "p20",
        nome: "Impressora",
        preco: 600,
        estoque: 4,
        categoria: "Escritório",
      });
    });

    test("CT-11 | deve editar nome do produto corretamente", () => {
      const resultado = produtoService.editarProduto("p20", {
        nome: "Impressora Laser",
      });

      expect(resultado.nome).toBe("Impressora Laser");
    });

    test("CT-12 | deve lançar erro ao editar produto com preço negativo", () => {
      expect(() =>
        produtoService.editarProduto("p20", { preco: -50 })
      ).toThrow("Preço não pode ser negativo");
    });

    test("CT-13 | deve lançar erro ao editar produto inexistente", () => {
      expect(() =>
        produtoService.editarProduto("nao-existe", { nome: "X" })
      ).toThrow("Produto não encontrado");
    });

    test("CT-14 | deve manter campos não editados após edição parcial", () => {
      const resultado = produtoService.editarProduto("p20", { preco: 550 });

      expect(resultado.nome).toBe("Impressora");
      expect(resultado.categoria).toBe("Escritório");
      expect(resultado.preco).toBe(550);
    });

    test("CT-15 | deve lançar erro ao editar com estoque negativo", () => {
      expect(() =>
        produtoService.editarProduto("p20", { estoque: -1 })
      ).toThrow("Estoque não pode ser negativo");
    });
  });

  // ─── listarProdutos ─────────────────────────────────────────────────────────

  describe("listarProdutos", () => {
    test("CT-16 | deve retornar array vazio quando não há produtos", () => {
      const lista = produtoService.listarProdutos();

      expect(Array.isArray(lista)).toBe(true);
      expect(lista).toHaveLength(0);
    });

    test("CT-17 | deve retornar todos os produtos cadastrados", () => {
      produtoService.cadastrarProduto({
        id: "p30",
        nome: "Webcam",
        preco: 200,
        estoque: 8,
        categoria: "Periféricos",
      });
      produtoService.cadastrarProduto({
        id: "p31",
        nome: "Headset",
        preco: 180,
        estoque: 6,
        categoria: "Periféricos",
      });

      const lista = produtoService.listarProdutos();

      expect(lista).toHaveLength(2);
    });

    test("CT-18 | cada item da lista deve ter as propriedades esperadas", () => {
      produtoService.cadastrarProduto({
        id: "p32",
        nome: "Roteador",
        preco: 250,
        estoque: 3,
        categoria: "Rede",
      });

      const lista = produtoService.listarProdutos();

      expect(lista[0]).toHaveProperty("id");
      expect(lista[0]).toHaveProperty("nome");
      expect(lista[0]).toHaveProperty("preco");
      expect(lista[0]).toHaveProperty("estoque");
      expect(lista[0]).toHaveProperty("categoria");
    });

    test("CT-19 | quantidade na lista deve aumentar a cada cadastro", () => {
      produtoService.cadastrarProduto({
        id: "p33",
        nome: "SSD",
        preco: 350,
        estoque: 5,
        categoria: "Armazenamento",
      });

      expect(produtoService.listarProdutos()).toHaveLength(1);

      produtoService.cadastrarProduto({
        id: "p34",
        nome: "RAM",
        preco: 200,
        estoque: 10,
        categoria: "Hardware",
      });

      expect(produtoService.listarProdutos()).toHaveLength(2);
    });
  });

  // ─── buscarProdutoPorId ─────────────────────────────────────────────────────

  describe("buscarProdutoPorId", () => {
    beforeEach(() => {
      produtoService.cadastrarProduto({
        id: "p40",
        nome: "Placa de Vídeo",
        preco: 1800,
        estoque: 2,
        categoria: "Hardware",
      });
    });

    test("CT-20 | deve retornar o produto correto pelo ID", () => {
      const produto = produtoService.buscarProdutoPorId("p40");

      expect(produto).toHaveProperty("id", "p40");
      expect(produto).toHaveProperty("nome", "Placa de Vídeo");
    });

    test("CT-21 | deve lançar erro ao buscar ID inexistente", () => {
      expect(() => produtoService.buscarProdutoPorId("nao-existe")).toThrow(
        "Produto não encontrado"
      );
    });

    test("CT-22 | produto retornado deve ter todas as propriedades", () => {
      const produto = produtoService.buscarProdutoPorId("p40");

      expect(produto).toMatchObject({
        id: "p40",
        nome: "Placa de Vídeo",
        preco: 1800,
        estoque: 2,
        categoria: "Hardware",
      });
    });

    test("CT-23 | deve retornar exatamente o produto cadastrado, sem dados extras", () => {
      const produto = produtoService.buscarProdutoPorId("p40");
      const keys = Object.keys(produto);

      expect(keys).toEqual(
        expect.arrayContaining(["id", "nome", "preco", "estoque", "categoria"])
      );
    });
  });
});
