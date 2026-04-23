import { emailService } from "./emailService.js";

describe("emailService", () => {
  // ─── enviarConfirmacao ──────────────────────────────────────────────────────

  describe("enviarConfirmacao", () => {
    test("CT-40 | deve retornar mensagem de sucesso ao enviar confirmação", () => {
      const resultado = emailService.enviarConfirmacao("cliente@email.com", 123);

      expect(resultado).toBe("E-mail enviado para cliente@email.com");
    });

    test("CT-41 | deve lançar erro quando e-mail não for informado", () => {
      expect(() => emailService.enviarConfirmacao("", 123)).toThrow(
        "E-mail inválido"
      );
    });

    test("CT-42 | deve lançar erro quando número do pedido for undefined", () => {
      expect(() =>
        emailService.enviarConfirmacao("cliente@email.com", undefined)
      ).toThrow("Número do pedido inválido");
    });

    test("CT-43 | deve lançar erro quando número do pedido for null", () => {
      expect(() =>
        emailService.enviarConfirmacao("cliente@email.com", null)
      ).toThrow("Número do pedido inválido");
    });

    test("CT-44 | deve aceitar número do pedido igual a zero", () => {
      const resultado = emailService.enviarConfirmacao("a@b.com", 0);
      expect(resultado).toContain("a@b.com");
    });
  });

  // ─── enviarAlertaErro ───────────────────────────────────────────────────────

  describe("enviarAlertaErro", () => {
    test("CT-45 | deve retornar 'Alerta enviado' quando dados são válidos", () => {
      const resultado = emailService.enviarAlertaErro(
        "cliente@email.com",
        "Pagamento recusado"
      );

      expect(resultado).toBe("Alerta enviado");
    });

    test("CT-46 | deve lançar erro quando e-mail não for informado", () => {
      expect(() =>
        emailService.enviarAlertaErro("", "Erro qualquer")
      ).toThrow("E-mail inválido");
    });

    test("CT-47 | deve usar mensagem padrão quando erro não for informado", () => {
      // não deve lançar erro
      const resultado = emailService.enviarAlertaErro("x@y.com", "");
      expect(resultado).toBe("Alerta enviado");
    });

    test("CT-48 | deve funcionar com qualquer mensagem de erro", () => {
      const resultado = emailService.enviarAlertaErro(
        "x@y.com",
        "Produto esgotado"
      );
      expect(resultado).toBeTruthy();
    });
  });
});
