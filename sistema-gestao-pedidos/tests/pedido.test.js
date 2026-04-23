// Mock das dependências externas ANTES dos imports
jest.mock("./emailService.js", () => ({
  emailService: {
    enviarConfirmacao: jest.fn().mockReturnValue("E-mail enviado (mock)"),
    enviarAlertaErro: jest.fn().mockReturnValue("Alerta enviado (mock)"),
  },
}));

jest.mock("./carrinhoService.js", () => ({
  carrinhoService: {
    calcularSubtotal: jest.fn(),
  },
}));

import { pedidoService } from "./pedidoService.js";
import { emailService } from "./emailService.js";
import { carrinhoService } from "./carrinhoService.js";

describe("pedidoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── aplicarCupom ───────────────────────────────────────────────────────────

  describe("aplicarCupom", () => {
    test("CT-49 | deve retornar valor original quando cupom não é informado", () => {
      const resultado = pedidoService.aplicarCupom(100, null);

      expect(resultado).toBe(100);
    });

    test("CT-50 | deve aplicar 10% de desconto com cupom DESC10", () => {
      const resultado = pedidoService.aplicarCupom(200, "DESC10");

      expect(resultado).toBe(180);
    });

    test("CT-51 | deve aplicar 20% de desconto com cupom DESC20", () => {
      const resultado = pedidoService.aplicarCupom(500, "DESC20");

      expect(resultado).toBe(400);
    });

    test("CT-52 | deve lançar erro para cupom inválido", () => {
      expect(() => pedidoService.aplicarCupom(100, "CUPOMINVALIDO")).toThrow(
        "Cupom inválido"
      );
    });

    test("CT-53 | deve retornar valor sem modificar quando cupom é string vazia", () => {
      const resultado = pedidoService.aplicarCupom(300, "");

      expect(resultado).toBe(300);
    });

    test("CT-54 | desconto DESC10 deve ser proporcional ao valor", () => {
      // 10% de 1000 = 900
      expect(pedidoService.aplicarCupom(1000, "DESC10")).toBeCloseTo(900);
    });
  });

  // ─── calcularFrete ──────────────────────────────────────────────────────────

  describe("calcularFrete", () => {
    test("CT-55 | deve retornar frete grátis para compras acima de R$ 200", () => {
      const frete = pedidoService.calcularFrete("70000-000", 250);

      expect(frete).toBe(0);
    });

    test("CT-56 | deve retornar R$ 20 para compras abaixo de R$ 200", () => {
      const frete = pedidoService.calcularFrete("70000-000", 100);

      expect(frete).toBe(20);
    });

    test("CT-57 | deve retornar frete grátis exatamente no valor de R$ 200 (limite)", () => {
      const frete = pedidoService.calcularFrete("70000-000", 200);

      expect(frete).toBe(0);
    });

    test("CT-58 | deve retornar R$ 20 para valor de R$ 199,99", () => {
      const frete = pedidoService.calcularFrete("70000-000", 199.99);

      expect(frete).toBe(20);
    });

    test("CT-59 | frete deve ser número", () => {
      const frete = pedidoService.calcularFrete("00000-000", 50);

      expect(typeof frete).toBe("number");
    });
  });

  // ─── fecharPedido ──────────────────────────────────────────────────────────

  describe("fecharPedido", () => {
    const clienteValido = {
      nome: "João Silva",
      email: "joao@email.com",
      cep: "70000-000",
    };

    const carrinhoValido = [
      { id: "p1", nome: "Notebook", preco: 2500, quantidade: 1 },
    ];

    beforeEach(() => {
      // subtotal padrão para esses testes
      carrinhoService.calcularSubtotal.mockReturnValue(2500);
    });

    test("CT-60 | deve fechar pedido corretamente com dados válidos", () => {
      const pedido = pedidoService.fecharPedido(
        clienteValido,
        carrinhoValido,
        null
      );

      expect(pedido).toHaveProperty("cliente", "João Silva");
      expect(pedido).toHaveProperty("email", "joao@email.com");
      expect(pedido).toHaveProperty("subtotal", 2500);
      expect(pedido).toHaveProperty("totalFinal");
    });

    test("CT-61 | deve lançar erro ao fechar pedido com carrinho vazio", () => {
      expect(() =>
        pedidoService.fecharPedido(clienteValido, [], null)
      ).toThrow("Carrinho vazio");
    });

    test("CT-62 | deve lançar erro quando cliente não tem e-mail", () => {
      const clienteSemEmail = { nome: "Maria", cep: "70000-000" };

      expect(() =>
        pedidoService.fecharPedido(clienteSemEmail, carrinhoValido, null)
      ).toThrow("Cliente inválido");
    });

    test("CT-63 | deve lançar erro quando cliente é null", () => {
      expect(() =>
        pedidoService.fecharPedido(null, carrinhoValido, null)
      ).toThrow("Cliente inválido");
    });

    test("CT-64 | deve chamar emailService.enviarConfirmacao (mock) ao fechar pedido", () => {
      pedidoService.fecharPedido(clienteValido, carrinhoValido, null);

      expect(emailService.enviarConfirmacao).toHaveBeenCalledTimes(1);
      expect(emailService.enviarConfirmacao).toHaveBeenCalledWith(
        "joao@email.com",
        expect.any(Number)
      );
    });

    test("CT-65 | pedido fechado deve conter os itens do carrinho", () => {
      const pedido = pedidoService.fecharPedido(
        clienteValido,
        carrinhoValido,
        null
      );

      expect(pedido.itens).toEqual(carrinhoValido);
      expect(Array.isArray(pedido.itens)).toBe(true);
    });

    test("CT-66 | deve aplicar cupom DESC10 e calcular total correto", () => {
      // subtotal = 500, DESC10 = 450, frete = 0 (>= 200) → total = 450
      carrinhoService.calcularSubtotal.mockReturnValue(500);

      const pedido = pedidoService.fecharPedido(
        clienteValido,
        carrinhoValido,
        "DESC10"
      );

      expect(pedido.totalFinal).toBeCloseTo(450);
    });

    test("CT-67 | pedido deve conter propriedade data do tipo Date", () => {
      const pedido = pedidoService.fecharPedido(
        clienteValido,
        carrinhoValido,
        null
      );

      expect(pedido.data).toBeInstanceOf(Date);
    });

    test("CT-68 | frete deve ser zero quando total com desconto >= 200", () => {
      carrinhoService.calcularSubtotal.mockReturnValue(300);

      const pedido = pedidoService.fecharPedido(
        clienteValido,
        carrinhoValido,
        null
      );

      expect(pedido.frete).toBe(0);
    });

    test("CT-69 | frete deve ser R$ 20 quando total com desconto < 200", () => {
      carrinhoService.calcularSubtotal.mockReturnValue(100);

      const pedido = pedidoService.fecharPedido(
        clienteValido,
        carrinhoValido,
        null
      );

      expect(pedido.frete).toBe(20);
      expect(pedido.totalFinal).toBe(120);
    });
  });
});
