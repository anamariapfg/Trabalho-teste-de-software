import { carrinhoService } from "./carrinhoService.js";

describe("carrinhoService", () => {
  let carrinho;
  let produtoBase;

  beforeEach(() => {
    carrinho = [];
    produtoBase = {
      id: "prod1",
      nome: "Teclado Mecânico",
      preco: 250,
      estoque: 10,
    };
  });

  // ─── adicionarAoCarrinho ────────────────────────────────────────────────────

  describe("adicionarAoCarrinho", () => {
    test("CT-24 | deve adicionar produto válido ao carrinho", () => {
      const resultado = carrinhoService.adicionarAoCarrinho(
        carrinho,
        produtoBase,
        2
      );

      expect(resultado).toHaveLength(1);
      expect(resultado[0]).toHaveProperty("id", "prod1");
      expect(resultado[0]).toHaveProperty("quantidade", 2);
    });

    test("CT-25 | deve lançar erro ao adicionar produto sem estoque", () => {
      const semEstoque = { ...produtoBase, estoque: 0 };

      expect(() =>
        carrinhoService.adicionarAoCarrinho(carrinho, semEstoque, 1)
      ).toThrow("Produto sem estoque");
    });

    test("CT-26 | deve lançar erro ao informar quantidade inválida (zero)", () => {
      expect(() =>
        carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 0)
      ).toThrow("Quantidade inválida");
    });

    test("CT-27 | deve lançar erro ao informar quantidade negativa", () => {
      expect(() =>
        carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, -3)
      ).toThrow("Quantidade inválida");
    });

    test("CT-28 | deve acumular quantidade ao adicionar produto já existente no carrinho", () => {
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 2);
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 3);

      expect(carrinho).toHaveLength(1);
      expect(carrinho[0].quantidade).toBe(5);
    });

    test("CT-29 | deve lançar erro ao exceder estoque disponível", () => {
      const produtoPoucoEstoque = { ...produtoBase, estoque: 2 };

      expect(() =>
        carrinhoService.adicionarAoCarrinho(carrinho, produtoPoucoEstoque, 5)
      ).toThrow("Estoque insuficiente");
    });

    test("CT-30 | item adicionado deve conter nome e preço corretos", () => {
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 1);

      expect(carrinho[0]).toMatchObject({
        id: "prod1",
        nome: "Teclado Mecânico",
        preco: 250,
        quantidade: 1,
      });
    });
  });

  // ─── removerDoCarrinho ──────────────────────────────────────────────────────

  describe("removerDoCarrinho", () => {
    beforeEach(() => {
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 2);
    });

    test("CT-31 | deve remover produto existente do carrinho", () => {
      const resultado = carrinhoService.removerDoCarrinho(carrinho, "prod1");

      expect(resultado).toHaveLength(0);
    });

    test("CT-32 | deve lançar erro ao remover produto inexistente no carrinho", () => {
      expect(() =>
        carrinhoService.removerDoCarrinho(carrinho, "id-errado")
      ).toThrow("Produto não encontrado no carrinho");
    });

    test("CT-33 | carrinho deve ter tamanho correto após remoção", () => {
      const produto2 = {
        id: "prod2",
        nome: "Mouse Gamer",
        preco: 180,
        estoque: 5,
      };
      carrinhoService.adicionarAoCarrinho(carrinho, produto2, 1);

      carrinhoService.removerDoCarrinho(carrinho, "prod1");

      expect(carrinho).toHaveLength(1);
      expect(carrinho[0].id).toBe("prod2");
    });

    test("CT-34 | deve retornar array após remoção", () => {
      const resultado = carrinhoService.removerDoCarrinho(carrinho, "prod1");

      expect(Array.isArray(resultado)).toBe(true);
    });
  });

  // ─── calcularSubtotal ───────────────────────────────────────────────────────

  describe("calcularSubtotal", () => {
    test("CT-35 | deve retornar zero para carrinho vazio", () => {
      const subtotal = carrinhoService.calcularSubtotal([]);

      expect(subtotal).toBe(0);
    });

    test("CT-36 | deve calcular subtotal corretamente com um item", () => {
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 3);
      const subtotal = carrinhoService.calcularSubtotal(carrinho);

      // 250 * 3 = 750
      expect(subtotal).toBe(750);
    });

    test("CT-37 | deve somar subtotal de múltiplos itens", () => {
      const produto2 = {
        id: "prod2",
        nome: "Mouse",
        preco: 100,
        estoque: 5,
      };

      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 2); // 500
      carrinhoService.adicionarAoCarrinho(carrinho, produto2, 1); // 100

      const subtotal = carrinhoService.calcularSubtotal(carrinho);

      expect(subtotal).toBe(600);
    });

    test("CT-38 | resultado deve ser um número", () => {
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 1);
      const subtotal = carrinhoService.calcularSubtotal(carrinho);

      expect(typeof subtotal).toBe("number");
    });

    test("CT-39 | subtotal deve atualizar após adicionar mais itens", () => {
      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 1); // 250

      const subtotalAntes = carrinhoService.calcularSubtotal(carrinho);
      expect(subtotalAntes).toBe(250);

      carrinhoService.adicionarAoCarrinho(carrinho, produtoBase, 1); // +250
      const subtotalDepois = carrinhoService.calcularSubtotal(carrinho);
      expect(subtotalDepois).toBe(500);
    });
  });
});
