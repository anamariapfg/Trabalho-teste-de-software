const { cadastrarUsuario, aplicarDesconto, listarUsuarios } = require("./sistema");
const { enviarNotificacao } = require("./notificacao");

// Etapa 6: Simulação da função enviarNotificacao
jest.mock("./notificacao");

// Etapa 1: Organização dos testes
describe("Cadastro de Usuário", () => {

  // Etapa 2: Testes de validação
  test("Deve retornar erro quando o nome está vazio", () => {
    expect(cadastrarUsuario("", "ana@email.com", 25)).toBe("Dados obrigatórios");
  });

  test("Deve retornar erro quando o email está vazio", () => {
    expect(cadastrarUsuario("Ana", "", 25)).toBe("Dados obrigatórios");
  });

  test("Deve retornar erro quando a idade é menor ou igual a 18", () => {
    expect(cadastrarUsuario("Ana", "ana@email.com", 18)).toBe("Usuário deve ser maior de idade");
  });

  test("Deve retornar erro quando o email é inválido", () => {
    expect(cadastrarUsuario("Ana", "emailinvalido.com", 25)).toBe("Email inválido");
  });

  // Etapa 3 e Etapa 6: Cadastro válido e Mock
  test("Deve retornar o objeto do usuário e chamar a notificação no cadastro válido", () => {
    const resultado = cadastrarUsuario("Ana", "ana@email.com", 25);
    
    expect(resultado).toEqual({
      nome: "Ana",
      email: "ana@email.com",
      idade: 25,
      ativo: true
    });

    expect(enviarNotificacao).toHaveBeenCalled();
    expect(enviarNotificacao).toHaveBeenCalledWith("ana@email.com", "Cadastro realizado");
  });
});

describe("Desconto", () => {
  // Etapa 5: Testes de valores
  test("Valor menor que 100", () => {
    expect(aplicarDesconto(50)).toBe(50);
  });

  test("Valor igual a 100", () => {
    expect(aplicarDesconto(100)).toBe(100);
  });

  test("Valor maior que 100", () => {
    expect(aplicarDesconto(200)).toBe(180);
  });

  test("Valor decimal", () => {
    expect(aplicarDesconto(150.50)).toBeCloseTo(135.45);
  });
});

describe("Lista de Usuários", () => {
  // Etapa 4: Testes de lista
  test("Validações da lista de usuários", () => {
    const lista = listarUsuarios();
    expect(lista).toHaveLength(4);
    expect(lista).toContain("Carlos");
    expect(lista).toContain("Diana");
    expect(lista).toEqual(["Ana", "Bruno", "Carlos", "Diana"]);
  });
});